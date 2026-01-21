<?php

use App\Http\Controllers\Admin\VendorController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Vendor\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:vendor')->group(function () {
        Route::apiResource('vendor/products', ProductController::class);
    });

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('admin/vendors', VendorController::class);
    });
});
