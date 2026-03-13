<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\LivreurController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ImageController;

/*
|--------------------------------------------------------------------------
| API Routes - Projet E-commerce Multi-Profils
|--------------------------------------------------------------------------
*/

// --- Routes Publiques ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Avec choix du rôle
Route::post('/reset-admin', [AuthController::class, 'resetAdminUser']); // DEBUG: Create admin
Route::get('/products', [ProductController::class, 'publicIndex']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// --- Routes Protégées (Middleware Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {

    // --- PROFIL : CLIENT ---
    Route::prefix('client')->group(function () {
        Route::get('/orders', [OrderController::class, 'clientOrders']);
        Route::post('/orders', [OrderController::class, 'store']); // Création de commande
        Route::post('/orders/{id}/confirm-receipt', [OrderController::class, 'confirmReceipt']);
        Route::get('/addresses', [LocationController::class, 'myAddresses']);
        Route::post('/addresses', [LocationController::class, 'storeAddress']);
    });

    // --- PROFIL : LIVREUR ---
    Route::prefix('livreur')->group(function () {
        Route::get('/available-orders', [OrderController::class, 'availableForLivreur']); // Filtre < 1km
        Route::post('/orders/{id}/accept', [OrderController::class, 'acceptOrder']);
        Route::post('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']); // Avec pénalité -100
        Route::post('/orders/{id}/declare-finished', [OrderController::class, 'declareFinished']);
        Route::get('/wallet', [LivreurController::class, 'walletHistory']);
        Route::post('/wallet/withdraw', [LivreurController::class, 'requestWithdraw']);
        Route::post('/documents', [LivreurController::class, 'uploadDocs']);
        Route::get('/profile-status', [LivreurController::class, 'checkStatus']);
    });

    // --- PROFIL : FOURNISSEUR (Desktop/Vue.js) ---
    Route::prefix('supplier')->group(function () {
        Route::get('/products', [SupplierController::class, 'myProducts']);
        Route::post('/products', [SupplierController::class, 'createProduct']);
        Route::put('/products/{id}', [SupplierController::class, 'updateProduct']);
        Route::delete('/products/{id}', [SupplierController::class, 'deleteProduct']);
    });

    // --- ADMIN ---
    Route::middleware('is_admin')->prefix('admin')->group(function () {
        // Users management
        Route::get('/users', [AuthController::class, 'allUsers']);
        Route::post('/users', [AuthController::class, 'storeUser']);
        Route::put('/users/{id}/status', [AuthController::class, 'updateUserStatus']);
        
        // Routes pour les produits admin
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Routes pour les images de produits admin
        Route::post('/products/{product}/images', [ImageController::class, 'uploadProductImage']);
        Route::get('/products/{product}/images', [ImageController::class, 'getProductImages']);
        Route::delete('/images/{image}', [ImageController::class, 'deleteProductImage']);

        // Routes pour les images de produits (admin peut gérer toutes les images)
        Route::post('/products/{product}/images', [ImageController::class, 'uploadProductImageAdmin']);
        Route::get('/products/{product}/images', [ImageController::class, 'getProductImagesAdmin']);
        Route::delete('/images/{image}', [ImageController::class, 'deleteProductImageAdmin']);

        // Stats & Global
        Route::get('/dashboard-stats', [OrderController::class, 'adminStats']);
        Route::get('/all-orders', [OrderController::class, 'allOrders']);
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'me']);
});
