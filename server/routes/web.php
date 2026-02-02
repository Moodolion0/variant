<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\LivreurDocumentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WalletTransactionController;

Route::get('/', function () {
    return view('welcome');
});

// Routes API temporaires pour tester
Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::resource('wallets', WalletController::class);
Route::resource('wallet-transactions', WalletTransactionController::class);

Route::resource('users', UserController::class);
Route::resource('livreur-documents', LivreurDocumentController::class);
// Route::resource('suppliers', SupplierController::class); // Temporairement commenté
Route::resource('products', ProductController::class);
Route::resource('product-images', ProductImageController::class);
Route::resource('locations', LocationController::class);
Route::resource('orders', OrderController::class);
Route::resource('order-items', OrderItemController::class);
Route::resource('wallets', WalletController::class);
