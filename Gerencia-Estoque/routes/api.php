<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// ============ Dashboard (Home) ============
Route::get('/home', function () {
  return response()->json([
    'salesToday'    => 3,
    'repairsToday'  => 2,
    'revenueToday'  => 1299.90,
    'lowStockCount' => 4,
  ]);
});

// ============ Products (Baixo estoque e listagem) ============
Route::get('/products', function (Request $req) {
  $all = [
    ['id'=>1,'name'=>'SSD 1TB NVMe','sku'=>'SSD-1TB-NVME','category'=>'armazenamento','stock'=>2,'min_stock'=>3,'sale_price'=>399.90],
    ['id'=>2,'name'=>'Memória 16GB DDR4','sku'=>'RAM-16-DDR4','category'=>'memória','stock'=>8,'min_stock'=>5,'sale_price'=>229.90],
    ['id'=>3,'name'=>'Fonte 600W 80+ Bronze','sku'=>'PSU-600B','category'=>'energia','stock'=>0,'min_stock'=>2,'sale_price'=>319.00],
    ['id'=>4,'name'=>'Cabo HDMI 2.1','sku'=>'HDMI-21','category'=>'acessórios','stock'=>5,'min_stock'=>8,'sale_price'=>39.90],
  ];
    
  if ($req->boolean('low')) {
    $low = array_values(array_filter($all, fn($p) => $p['stock'] <= $p['min_stock']));
    $limit = (int)($req->get('limit', 5));
    return response()->json(['data'=>array_slice($low, 0, $limit)]);
  }
  
  // Filtro simples por busca
  $q = strtolower($req->get('q',''));
  if ($q) {
  $all = array_values(array_filter($all, function($p) use ($q){
    return str_contains(strtolower($p['name']), $q) || str_contains(strtolower($p['sku']), $q);
    }));
  }
  return response()->json(['data'=>$all, 'total'=>count($all)]);
});
    
// ============ Clients (Visão por representantes) ============
Route::get('/clients', function () {
  return response()->json(['data'=>[
    ['id'=>1,'name'=>'Tech Solutions','email'=>'contato@tech.com','phone'=>'(11) 90000-0000'],
    ['id'=>2,'name'=>'PC Gamer BR','email'=>null,'phone'=>'(21) 98888-7777'],
  ]]);
});

// ============ Sales (Resumo de vendas no dia) ============
Route::get('/sales', function (Request $req) {
  // filtros: ?date=YYYY-MM-DD
  $date = $req->get('date', date('Y-m-d'));
  return response()->json(['data'=>[
    ['id'=>101,'client'=>'Tech Solutions','total'=>899.90,'created_at'=>$date.' 10:20:00','status'=>'paid'],
    ['id'=>102,'client'=>'PC Gamer BR','total'=>399.90,'created_at'=>$date.' 15:05:00','status'=>'open'],
  ], 'date'=>$date]);
});

// ============ Repairs (Resumo de consertos no dia) ============
Route::get('/repairs', function (Request $req) {
  $date = $req->get('date', date('Y-m-d'));
  return response()->json(['data'=>[
    ['id'=>501,'client'=>'Tech Solutions','device'=>'Notebook','status'=>'in_progress','price'=>null,'created_at'=>$date.' 09:10:00'],
    ['id'=>502,'client'=>'PC Gamer BR','device'=>'Desktop','status'=>'ready','price'=>249.90,'created_at'=>$date.' 14:45:00'],
  ], 'date'=>$date]);
});