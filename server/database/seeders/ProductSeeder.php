<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = Supplier::all();
        
        if ($suppliers->isEmpty()) {
            $this->command->info('No suppliers found. Creating default suppliers first...');
            $this->call(SupplierSeeder::class);
            $suppliers = Supplier::all();
        }

        $products = [
            // Electronics
            ['name' => 'Smartphone Samsung Galaxy S24', 'price' => 799.99, 'keywords' => 'Electronics,Smartphone', 'description' => 'Smartphone haut de gamme avec écran AMOLED', 'stock' => 25],
            ['name' => 'MacBook Pro 14 pouces', 'price' => 1999.99, 'keywords' => 'Electronics,Computer', 'description' => 'Ordinateur portable professionnel', 'stock' => 10],
            ['name' => 'AirPods Pro', 'price' => 249.99, 'keywords' => 'Electronics,Audio', 'description' => 'Ecouteurs sans fil avec réduction de bruit', 'stock' => 50],
            ['name' => 'iPad Air', 'price' => 599.99, 'keywords' => 'Electronics,Tablet', 'description' => 'Tablette polyvalente', 'stock' => 20],
            ['name' => 'Montre connectée Apple Watch', 'price' => 399.99, 'keywords' => 'Electronics,Watch', 'description' => 'Montre connectée dernière génération', 'stock' => 30],
            
            // Clothing
            ['name' => 'T-shirt coton bio', 'price' => 24.99, 'keywords' => 'Clothing,T-shirt', 'description' => 'T-shirt confortable en coton biologique', 'stock' => 100],
            ['name' => 'Jean slim', 'price' => 59.99, 'keywords' => 'Clothing,Pants', 'description' => 'Jean moderne coupe slim', 'stock' => 75],
            ['name' => 'Sneakers Nike Air Max', 'price' => 129.99, 'keywords' => 'Clothing,Shoes', 'description' => 'Chaussures de sport tendance', 'stock' => 40],
            ['name' => 'Veste en cuir', 'price' => 189.99, 'keywords' => 'Clothing,Jacket', 'description' => 'Veste en cuir véritable', 'stock' => 15],
            ['name' => 'Robe été', 'price' => 49.99, 'keywords' => 'Clothing,Dress', 'description' => 'Robe légère pour lété', 'stock' => 60],
            
            // Home
            ['name' => 'Canapé 3 places', 'price' => 899.99, 'keywords' => 'Home,Furniture', 'description' => 'Canapé moderne gris', 'stock' => 8],
            ['name' => 'Table à manger 6 personnes', 'price' => 449.99, 'keywords' => 'Home,Furniture', 'description' => 'Table en bois massif', 'stock' => 12],
            ['name' => 'Lampe de salon', 'price' => 79.99, 'keywords' => 'Home,Lighting', 'description' => 'Lampe design LED', 'stock' => 35],
            ['name' => 'Cuisine complète', 'price' => 1299.99, 'keywords' => 'Home,Kitchen', 'description' => 'Cuisine équipée moderne', 'stock' => 5],
            
            // Food
            ['name' => 'Panier fruits bio', 'price' => 34.99, 'keywords' => 'Food,Fruits', 'description' => 'Panier de fruits biologiques', 'stock' => 50],
            ['name' => 'Coffret thés premium', 'price' => 29.99, 'keywords' => 'Food,Tea', 'description' => 'Sélection de thés du monde', 'stock' => 80],
            ['name' => 'Huiles dolive vierges', 'price' => 19.99, 'keywords' => 'Food,Oil', 'description' => 'Huiles dolive de qualité', 'stock' => 100],
            
            // Sports
            ['name' => 'Vélo de ville', 'price' => 449.99, 'keywords' => 'Sports,Bike', 'description' => 'Vélo électrique urbain', 'stock' => 15],
            ['name' => 'Sac de sport Nike', 'price' => 44.99, 'keywords' => 'Sports,Bag', 'description' => 'Sac resistant et élégant', 'stock' => 60],
            ['name' => 'Yoga Mat premium', 'price' => 39.99, 'keywords' => 'Sports,Yoga', 'description' => 'Tapis de yoga écologique', 'stock' => 70],
        ];

        foreach ($products as $product) {
            Product::create([
                'name_supplier' => $product['name'],
                'description_supplier' => $product['description'],
                'price_supplier' => $product['price'],
                'stock_quantity' => $product['stock'],
                'supplier_id' => $suppliers->random()->id,
                'visible_in_catalog' => false, // Products start invisible
            ]);
        }

        $this->command->info('Products seeded successfully!');
    }
}
