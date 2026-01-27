<?php

use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Http\Controllers\Customer\CartController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/products', [VendorProductController::class, 'all']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::middleware('role:vendor')->group(function () {
        Route::apiResource('vendor/products', VendorProductController::class);
    });

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('admin/vendors', VendorController::class);
        Route::apiResource('admin/products', AdminProductController::class);
        Route::post('admin/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus']);
    });

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/item/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/item/{cartItem}', [CartController::class, 'remove']);
    Route::get('/cart/count', [CartController::class, 'count']);
});
