<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Product;
use App\Models\Product_image;
use App\Models\Order;
use App\Models\Order_item;
use App\Http\Requests\SupplierStoreRequest;
use App\Http\Requests\SupplierUpdateRequest;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected SupplierService $service;

    public function __construct(SupplierService $service)
    {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        // Admins can always view all suppliers; for other users, check authorization
        if (!auth()->user()?->isAdmin()) {
            $this->authorize('viewAny', Supplier::class);
        }
        $suppliers = Supplier::paginate();

        return response()->json($suppliers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SupplierStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Supplier::class);
        $supplier = $this->service->create($request->validated());

        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier): JsonResponse
    {
        $this->authorize('view', $supplier);
        return response()->json($supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SupplierUpdateRequest $request, Supplier $supplier): JsonResponse
    {
        $this->authorize('update', $supplier);
        $supplier = $this->service->update($supplier, $request->validated());

        return response()->json($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier): JsonResponse
    {
        $this->authorize('delete', $supplier);
        $this->service->delete($supplier);

        return response()->json(null, 204);
    }

    /**
     * Get products for the authenticated supplier
     */
    public function myProducts(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Only suppliers can access their products
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Find or create supplier for this user
        $supplier = Supplier::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->full_name]
        );

        $products = $supplier->products()->paginate();
        return response()->json($products);
    }

/**
      * Create a product for the authenticated supplier
      */
    public function createProduct(Request $request): JsonResponse
    {
        \Log::debug('createProduct called', [
            'has_user' => auth()->check(),
            'user_id' => auth()->id(),
            'user_role' => auth()->user()?->role,
            'bearer_token' => $request->bearerToken() ? 'present (' . strlen($request->bearerToken()) . ' chars)' : 'MISSING',
            'has_auth_header' => $request->hasHeader('Authorization'),
            'content_type' => $request->header('Content-Type'),
        ]);
        
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated - No user found',
                'debug' => [
                    'bearer_token' => $request->bearerToken() ? 'present' : 'missing',
                    'has_authorization_header' => $request->hasHeader('Authorization'),
                ]
            ], 401);
        }
        
        // Only suppliers can create products
        if ($user->role !== 'fournisseur') {
            return response()->json([
                'message' => 'Unauthorized - Only suppliers can create products',
                'user_role' => $user->role
            ], 403);
        }

        // Find or create supplier for this user
        $supplier = Supplier::firstOrCreate(
            ['user_id' => $user->id],
            ['name' => $user->full_name]
        );

        // Validate input
        $validated = $request->validate([
            'name_supplier' => 'required|string|max:255',
            'description_supplier' => 'nullable|string',
            'price_supplier' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'properties' => 'nullable|array',
        ]);

        // Add supplier_id
        $validated['supplier_id'] = $supplier->id;

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    /**
     * Update a product for the authenticated supplier
     */
    public function updateProduct(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        
        // Only suppliers can update their products
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Find supplier for this user
        $supplier = Supplier::where('user_id', $user->id)->first();
        
        // Check if supplier owns this product
        if (!$supplier || $product->supplier_id !== $supplier->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate input
        $validated = $request->validate([
            'name_supplier' => 'sometimes|string|max:255',
            'description_supplier' => 'nullable|string',
            'price_supplier' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'properties' => 'nullable|array',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    /**
     * Delete a product for the authenticated supplier
     */
    public function deleteProduct(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        
        // Only suppliers can delete their products
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Find supplier for this user
        $supplier = Supplier::where('user_id', $user->id)->first();
        
        // Check if supplier owns this product
        if (!$supplier || $product->supplier_id !== $supplier->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $product->delete();
        return response()->json(null, 204);
    }

    // ===== Gestion des images produits =====

    /**
     * Uploader une image pour un produit du fournisseur
     */
    public function uploadProductImage(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $supplier = Supplier::where('user_id', $user->id)->firstOrFail();
        $product  = Product::where('id', $id)->where('supplier_id', $supplier->id)->firstOrFail();

        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $cloudinary = new \App\Services\CloudinaryService();
        $uploadResult = $cloudinary->upload($request->file('image'), 'supplier_products');

        if (!$uploadResult['success']) {
            return response()->json([
                'success' => false,
                'message' => $uploadResult['error'],
            ], 500);
        }

        $image = Product_image::create([
            'product_id'          => $product->id,
            'file_url'            => $uploadResult['url'],
            'cloudinary_public_id' => $uploadResult['public_id'],
            'width'               => $uploadResult['width'],
            'height'              => $uploadResult['height'],
        ]);

        return response()->json(['success' => true, 'data' => $image], 201);
    }

    /**
     * Lister les images d'un produit du fournisseur
     */
    public function getProductImages(int $id): JsonResponse
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $supplier = Supplier::where('user_id', $user->id)->firstOrFail();
        $product  = Product::where('id', $id)->where('supplier_id', $supplier->id)->firstOrFail();

        $images = $product->images()->get();
        return response()->json(['success' => true, 'data' => $images]);
    }

    /**
     * Supprimer une image d'un produit du fournisseur
     */
    public function deleteProductImage(Product_image $image): JsonResponse
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $supplier = Supplier::where('user_id', $user->id)->firstOrFail();

        if ($image->product->supplier_id !== $supplier->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($image->cloudinary_public_id) {
            $cloudinary = new \App\Services\CloudinaryService();
            $cloudinary->delete($image->cloudinary_public_id);
        }

        $image->delete();
        return response()->json(['success' => true, 'message' => 'Image supprimée']);
    }

    /**
     * Récupérer les commandes liées aux produits du fournisseur
     */
    public function supplierOrders(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $supplier = Supplier::where('user_id', $user->id)->firstOrFail();

        $orderIds = Order_item::whereHas('product', function ($query) use ($supplier) {
            $query->where('supplier_id', $supplier->id);
        })->pluck('order_id')->unique();

        $orders = Order::whereIn('id', $orderIds)
            ->with(['client', 'livreur', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
}
