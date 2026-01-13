<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => \App\Models\User::factory(),
            'livreur_id' => null,
            'status' => $this->faker->randomElement([
                'en_attente','paye','en_cours_livraison','livre','termine','annule'
            ]),
            'delivery_lat' => $this->faker->latitude(),
            'delivery_long' => $this->faker->longitude(),
            'total_price' => $this->faker->randomFloat(2, 5, 200),
            'delivery_fee' => $this->faker->randomFloat(2, 0, 20),
            'declared_finished_at' => null,
            'confirmed_at' => null,
        ];
    }
}
