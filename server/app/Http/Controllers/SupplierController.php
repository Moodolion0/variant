<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Product;
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
        $this->authorize('viewAny', Supplier::class);
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
        $user = $request->user();
        
        // Only suppliers can create products
        if ($user->role !== 'fournisseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
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
}
