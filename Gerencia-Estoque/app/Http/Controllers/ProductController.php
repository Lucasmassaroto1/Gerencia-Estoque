<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductResource;

class ProductController extends Controller{
  public function index(Request $request){
    $q   = trim((string)$request->query('q', ''));
    $low = (int)$request->query('low', 0);
    $per = (int)$request->query('per_page', 50);

    $query = Product::query()->orderByDesc('id');

    if($q !== ''){
      $query->where(function ($w) use ($q){
        $w->where('name', 'like', "%{$q}%")
          ->orWhere('sku', 'like', "%{$q}%")
          ->orWhere('category', 'like', "%{$q}%");
      });
    }

    if($low === 1){
      $query->whereColumn('stock', '<', 'min_stock');
    }

    $paginator = $query->paginate($per)->appends($request->query());

    return response()->json([
      'data' => ProductResource::collection($paginator->items()),
      'meta' => [
        'current_page' => $paginator->currentPage(),
        'per_page'     => $paginator->perPage(),
        'total'        => $paginator->total(),
        'last_page'    => $paginator->lastPage(),
      ],
    ]);
  }

  public function show(Product $product){
    return response()->json(['data' => new ProductResource($product)]);
  }

  public function store(ProductStoreRequest $request){
    $product = Product::create($request->validated());
    return response()->json(['data' => new ProductResource($product)], 201);
  }

  public function update(ProductUpdateRequest $request, Product $product){
    $product->update($request->validated());
    return response()->json(['data' => new ProductResource($product)]);
  }

  public function destroy(Product $product){
    $product->delete();
    return response()->json(['data' => true]);
  }
}