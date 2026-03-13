<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SupplierSeeder::class,
            ProductSeeder::class,
            ProductImageSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,
            LocationSeeder::class,
            WalletSeeder::class,
            WalletTransactionSeeder::class,
            LivreurDocumentSeeder::class,
        ]);
    }
}
