<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;

class SaleController extends Controller{
  public function index(Request $request){
    $date = $request->query('date'); // YYYY-MM-DD
    $query = Sale::query()->with('client');

    if($date){
      $query->whereDate('sold_at', $date)
        ->orWhereDate('created_at', $date);
    }

    $items = $query->orderByDesc('id')->get()->map(function($s){
      return[
        'id' => $s->id,
        'client' => optional($s->client)->name,
        'total' => (float)$s->total_amount,
        'status' => $s->status,
        'created_at' => $s->created_at,
      ];
    });

    return response()->json(['data' => $items]);
  }
}
