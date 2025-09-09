<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Repair;
use App\Models\Product;

class DashboardController extends Controller{
  public function index(){
    $today = now()->toDateString();

    $salesToday = Sale::whereDate('created_at', $today)->count();
    $repairsToday = Repair::whereDate('created_at', $today)->count();
    $revenueToday = (float) Sale::whereDate('created_at', $today)->sum('total_amount');
    $lowStockCount = Product::whereColumn('stock','<','min_stock')->count();

    return response()->json([
      'salesToday' => $salesToday,
      'repairsToday' => $repairsToday,
      'revenueToday' => $revenueToday,
      'lowStockCount' => $lowStockCount,
    ]);
  }
}
