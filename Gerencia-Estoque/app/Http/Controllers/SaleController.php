<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Client;

class SaleController extends Controller{
  public function index(Request $request){
    $date = $request->query('date'); // YYYY-MM-DD

    $query = Sale::query()
      ->with('client')
      ->where('representative_id', auth()->id());

      if($date){
        $query->where(function ($q) use ($date){
          $q->whereDate('sold_at', $date)
            ->orWhereDate('created_at', $date);
        });
      }else{
        $today = now()->toDateString();
        $query->where(function ($q) use ($today){
          $q->whereDate('sold_at', $today)
            ->orWhereDate('created_at', $today);
        });
      }

      $items = $query->orderByDesc('id')->get()->map(function ($s){
        return [
          'id' => $s->id,
          'client' => optional($s->client)->name,
          'total' => (float) $s->total_amount,
          'status' => $s->status,
          'created_at' => optional($s->created_at)?->format('d/m/Y H:i'),
        ];
      });

    return response()->json(['data' => $items]);
  }

  public function store(Request $request){
    $data = $request->validate([
        'client_id' => ['required','exists:clients,id'],
        'sold_at' => ['nullable','date'],
        'status' => ['nullable','string','max:50'],
        'items' => ['required','array','min:1'],
        'items.*.product_id' => ['required','exists:products,id'],
        'items.*.qty' => ['required','integer','min:1'],
        'items.*.unit_price' => ['nullable','numeric','min:0'],
    ]);

    // garante que o cliente pertence ao representante logado
    $client = Client::where('id', $data['client_id'])
      ->where('user_id', auth()->id())
      ->first();

    if(!$client){
      abort(403, 'Cliente não pertence a você.');
    }

    /** @var \App\Models\Sale $sale */
    $sale = DB::transaction(function () use ($data){
      $sale = Sale::create([
        'representative_id' => auth()->id(),
        'client_id' => $data['client_id'],
        'status' => $data['status'] ?? 'paid',
        'sold_at' => $data['sold_at'] ?? now(),
        'total_amount' => 0,
      ]);

    foreach ($data['items'] as $i => $row){
      // lock pessimista no produto
      $product = Product::where('id', $row['product_id'])->lockForUpdate()->firstOrFail();
      $qty = (int) $row['qty'];

      // se vier com vírgula, normaliza
      $unit = isset($row['unit_price'])
        ? (float) str_replace(',', '.', $row['unit_price'])
        : (float) $product->sale_price;

      if($product->stock < $qty){
        throw ValidationException::withMessages([
          "items.$i.qty" => "Estoque insuficiente para {$product->name} (disp.: {$product->stock}).",
        ]);
      }

      SaleItem::create([
        'sale_id' => $sale->id,
        'product_id' => $product->id,
        'qty' => $qty,
        'unit_price' => $unit,
        'subtotal' => $qty * $unit,
      ]);

      // baixa estoque
      $product->decrement('stock', $qty);
    }

      $sale->recalcTotal();

      // opcional: recarrega relacionamentos/campos
      return $sale->fresh();
    });

    if($request->expectsJson()){
      return response()->json([
        'data' => [
          'id' => $sale->id,
          'total' => (float) $sale->total_amount,
          'status' => $sale->status,
        ]
      ], 201);
    }

    return redirect('/sales')->with('success', 'Venda registrada!');
  }

  public function update(Request $request, Sale $sale){
    abort_if($sale->representative_id !== auth()->id(), 403);

    $data = $request->validate([
      'status' => ['required','string','max:50']
    ]);

    $sale->update(['status' => $data['status']]);

    if($request->expectsJson()){
      return response()->json(['data' => true]);
    }
    return redirect('/sales')->with('success', 'Venda atualizada!');
  }

  public function destroy(Sale $sale){
    abort_if($sale->representative_id !== auth()->id(), 403);

    DB::transaction(function () use ($sale){
      foreach ($sale->items as $it){
        Product::where('id', $it->product_id)->lockForUpdate()->increment('stock', $it->qty);
      }
      $sale->items()->delete();
      $sale->delete();
    });

    if(request()->expectsJson()){
      return response()->json(['data' => true]);
    }

    return redirect('/sales')->with('success', 'Venda excluída!');
  }

  public function show(Sale $sale){
    abort_if($sale->representative_id !== auth()->id(), 403);

    $sale->load(['client', 'items.product']);

    return response()->json([
      'data' => [
        'id' => $sale->id,
        'client' => optional($sale->client)->name,
        'status' => $sale->status,
        'sold_at' => optional($sale->sold_at)?->format('d/m/Y H:i'),
        'total' => (float) $sale->total_amount,
        'items' => $sale->items->map(function ($it) {
          return [
            'product' => optional($it->product)->name,
            'sku' => optional($it->product)->sku,
            'qty' => (int) $it->qty,
            'unit_price' => (float) $it->unit_price,
            'subtotal' => (float) $it->subtotal,
          ];
        })->values(),
      ],
    ]);
  }
}
