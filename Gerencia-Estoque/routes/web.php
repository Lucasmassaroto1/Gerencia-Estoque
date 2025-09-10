<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\AuthController;

// ============ ROTA LOGIN ============
Route::get('/login', fn() => view('login'))->name('login');
Route::get('/register', fn() => view('register'));
// Route::get('/logout', fn() => view('login'));

// ============ AUTENTICAÇÃO ============
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ============ ROTA PÁGINAS SE LOGADO ============
Route::middleware('auth')->group(function () {
    Route::get('/', fn() => view('home'));
    Route::get('/products', fn() => view('products'));
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