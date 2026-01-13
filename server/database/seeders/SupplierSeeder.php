<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Supplier::factory()->createMany([
            ['name' => 'Fournisseur Centre', 'latitude' => 48.8566, 'longitude' => 2.3522, 'address_text' => 'Paris, France'],
            ['name' => 'Fournisseur Nord', 'latitude' => 48.8708, 'longitude' => 2.3337, 'address_text' => 'Place, Paris'],
        ]);

        \App\Models\Supplier::factory(8)->create();
    }
}
