<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wallet_transaction>
 */
class WalletTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['credit_livraison','penalite_annulation','retrait']);

        $order = null;
        if ($type === 'credit_livraison') {
            $order = \App\Models\Order::factory()->create();
        }

        return [
            'user_id' => \App\Models\User::factory(),
            'type' => $type,
            'amount' => $this->faker->randomFloat(2, 1, 200),
            'order_id' => $order?->id,
        ];
    }
}
