<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        foreach ($users as $user) {
            // Skip if wallet already exists
            if (Wallet::where('user_id', $user->id)->exists()) {
                continue;
            }
            
            Wallet::create([
                'user_id' => $user->id,
                'balance' => $user->role === 'livreur' ? rand(0, 50000) / 100 : rand(1000, 50000) / 100,
            ]);
        }

        $this->command->info('Wallets seeded successfully!');
    }
}
