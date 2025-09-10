<?php

/* use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\RepairController;
use App\Http\Controllers\DashboardController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me', fn () => response()->json(['user' => auth()->user()]));

        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('products', ProductController::class);
        Route::apiResource('clients',  ClientController::class);

        Route::get('/sales',   [SaleController::class, 'index']);
        Route::get('/repairs', [RepairController::class, 'index']);
    });
}); */