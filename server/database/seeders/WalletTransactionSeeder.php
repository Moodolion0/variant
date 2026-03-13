<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Wallet_transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WalletTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $livreurs = User::where('role', 'livreur')->where('status', 'valide')->get();
        $orders = Order::whereNotNull('livreur_id')->get();
        
        if ($livreurs->isEmpty()) {
            $this->command->info('No livreurs found. Skip wallet transactions.');
            return;
        }

        $types = ['credit_livraison', 'penalite_annulation', 'retrait'];

        foreach ($livreurs as $livreur) {
            // Create some transactions for each livreur
            for ($i = 0; $i < rand(2, 5); $i++) {
                $order = $orders->random() ?? null;
                
                Wallet_transaction::create([
                    'user_id' => $livreur->id,
                    'type' => $types[array_rand($types)],
                    'amount' => rand(500, 5000) / 100,
                    'order_id' => $order ? $order->id : null,
                ]);
            }
        }

        $this->command->info('Wallet transactions seeded successfully!');
    }
}
