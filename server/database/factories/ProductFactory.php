<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'supplier_id' => \App\Models\Supplier::factory(),
            'name_supplier' => $this->faker->words(3, true),
            'description_supplier' => $this->faker->paragraph(),
            'price_supplier' => $this->faker->randomFloat(2, 1, 500),
            'stock_quantity' => $this->faker->numberBetween(0, 200),
            'name_by_admin' => null,
            'description_by_admin' => null,
            'category' => null,
            'interest' => 0.00,
            'properties' => null,
            'visible_in_catalog' => false,
        ];
    }
}
