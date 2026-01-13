<?php

namespace App\Services;

use App\Models\Product_image;

class ProductImageService
{
    public function paginate($perPage = 15)
    {
        return Product_image::paginate($perPage);
    }

    public function create(array $data): Product_image
    {
        return Product_image::create([
            'product_id' => $data['product_id'],
            'file_url' => $data['file_url'],
        ]);
    }

    public function update(Product_image $productImage, array $data): Product_image
    {
        $productImage->fill(array_filter([
            'product_id' => $data['product_id'] ?? null,
            'file_url' => $data['file_url'] ?? null,
        ], fn($v) => !is_null($v)));

        $productImage->save();

        return $productImage;
    }

    public function delete(Product_image $productImage): bool
    {
        return $productImage->delete();
    }
}
