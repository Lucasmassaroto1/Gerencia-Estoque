<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;

// ============ ROTA LOGIN ============
Route::get('/login', fn() => view('login'))->name('login');
Route::get('/register', fn() => view('register'));

// ============ AUTENTICAÇÃO ============
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ============ ROTA PÁGINAS SE LOGADO ============
Route::middleware('auth')->group(function () {
  Route::get('/', fn() => view('home'));

  Route::get('/dashboard/metrics', [DashboardController::class, 'index'])->name('dashboard.metrics');

  Route::get('/products', fn() => view('products'));

  Route::get('/products/list', [ProductController::class, 'index'])->name('products.list');

  Route::post('/products', [ProductController::class, 'store'])->name('products.store');

  Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');

  Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

  Route::get('/clients', fn() => view('clients'));
  Route::get('/sales', fn() => view('sales'));
  Route::get('/repairs', fn() => view('repairs'));
  

  Route::get('/me', function (){
    return response()->json([
      'ok'   => true,
      'user' => Auth::user(),
    ]);
  });
});