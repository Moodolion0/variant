<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;

class ProductController extends Controller
{
    protected ProductService $service;

    public function __construct(ProductService $service)
    {
        $this->service = $service;
        $this->authorizeResource(Product::class, 'product');
    }

    public function index()
    {
        $this->authorize('viewAny', Product::class);
        $products = $this->service->paginate();

        return response()->json($products);
    }

    public function store(StoreProductRequest $request)
    {
        $this->authorize('create', Product::class);
        $product = $this->service->create($request->validated());

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);
        return response()->json($product);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);
        $product = $this->service->update($product, $request->validated());

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $this->service->delete($product);

        return response()->json(null, 204);
    }

    // Supplier endpoints
    public function supplierInventory()
    {
        $products = \App\Models\Product::where('supplier_id', auth()->id())->paginate();

        return response()->json($products);
    }

    public function updateStock($id)
    {
        $product = \App\Models\Product::where('id', $id)->where('supplier_id', auth()->id())->firstOrFail();
        $data = request()->validate(['stock_quantity' => 'required|integer|min:0']);
        $product->stock_quantity = $data['stock_quantity'];
        $product->save();

        return response()->json($product);
    }
}
