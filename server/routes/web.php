<?php

use Illuminate\Support\Facades\Route;

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

Route::resource('wallets', WalletController::class);
Route::resource('wallet-transactions', WalletTransactionController::class);

Route::resource('users', UserController::class);
Route::resource('livreur-documents', LivreurDocumentController::class);
Route::resource('suppliers', SupplierController::class);
Route::resource('products', ProductController::class);
Route::resource('product-images', ProductImageController::class);
Route::resource('locations', LocationController::class);
Route::resource('orders', OrderController::class);
Route::resource('order-items', OrderItemController::class);
Route::resource('wallets', WalletController::class);
