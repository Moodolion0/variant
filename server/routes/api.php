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
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// --- Routes Protégées (Middleware Sanctum ou JWT) ---
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
        Route::get('/orders/to-prepare', [OrderController::class, 'supplierOrders']);
        Route::post('/orders/{id}/mark-ready', [OrderController::class, 'markAsReady']); // Déclenche alerte livreur
        Route::get('/inventory', [ProductController::class, 'supplierInventory']);
        Route::patch('/inventory/{id}', [ProductController::class, 'updateStock']);

        // Routes pour les images de produits
        Route::post('/products/{product}/images', [ImageController::class, 'uploadProductImage']);
        Route::get('/products/{product}/images', [ImageController::class, 'getProductImages']);
        Route::delete('/images/{image}', [ImageController::class, 'deleteProductImage']);
    });

    // --- PROFIL : ADMIN ---
    Route::prefix('admin')->middleware('is_admin')->group(function () {
        // Gestion Utilisateurs
        Route::get('/users', [AuthController::class, 'allUsers']);
        Route::get('/users/livreurs/pending', [LivreurController::class, 'pendingLivreurs']);
        Route::post('/users/livreurs/{id}/validate', [LivreurController::class, 'validateLivreur']);

        // Gestion Catalogue
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('suppliers', SupplierController::class);
        Route::apiResource('locations', LocationController::class); // Lieux de livraison prédéfinis

        // Stats & Global
        Route::get('/dashboard-stats', [OrderController::class, 'adminStats']);
        Route::get('/all-orders', [OrderController::class, 'allOrders']);
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'me']);
});
