<?php

namespace App\Http\Controllers;

use App\Models\Product_image;
use App\Http\Requests\StoreProduct_imageRequest;
use App\Http\Requests\UpdateProduct_imageRequest;
use App\Services\ProductImageService;

class ProductImageController extends Controller
{
    protected ProductImageService $service;

    public function __construct(ProductImageService $service)
    {
        $this->service = $service;
        $this->authorizeResource(Product_image::class, 'product_image');
    }

    public function index()
    {
        $this->authorize('viewAny', Product_image::class);
        $list = $this->service->paginate();

        return response()->json($list);
    }

    public function store(StoreProduct_imageRequest $request)
    {
        $this->authorize('create', Product_image::class);
        $item = $this->service->create($request->validated());

        return response()->json($item, 201);
    }

    public function show(Product_image $product_image)
    {
        $this->authorize('view', $product_image);
        return response()->json($product_image);
    }

    public function update(UpdateProduct_imageRequest $request, Product_image $product_image)
    {
        $this->authorize('update', $product_image);
        $item = $this->service->update($product_image, $request->validated());

        return response()->json($item);
    }

    public function destroy(Product_image $product_image)
    {
        $this->authorize('delete', $product_image);
        $this->service->delete($product_image);

        return response()->json(null, 204);
    }
}
