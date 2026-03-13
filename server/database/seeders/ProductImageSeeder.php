<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Product_image;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        
        // Sample image URLs (placeholder images)
        $imageUrls = [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
            'https://images.unsplash.com/photo-1491553895911-0055uj?w=400',
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
        ];

        foreach ($products as $product) {
            // Add main image
            Product_image::create([
                'product_id' => $product->id,
                'file_url' => $imageUrls[array_rand($imageUrls)],
                'cloudinary_public_id' => null,
                'width' => 400,
                'height' => 400,
            ]);
            
            // Add 1-2 more images for some products
            if (rand(0, 1)) {
                Product_image::create([
                    'product_id' => $product->id,
                    'file_url' => $imageUrls[array_rand($imageUrls)],
                    'cloudinary_public_id' => null,
                    'width' => 400,
                    'height' => 400,
                ]);
            }
        }

        $this->command->info('Product images seeded successfully!');
    }
}
