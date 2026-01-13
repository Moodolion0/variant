<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'latitude' => $this->faker->latitude(48.0, 49.0),
            'longitude' => $this->faker->longitude(2.0, 3.0),
            'address_text' => $this->faker->address(),
        ];
    }
}
