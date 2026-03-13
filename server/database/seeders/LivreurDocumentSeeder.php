<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LivreurDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only create documents for users with role 'livreur'
        $livreurs = \App\Models\User::where('role', \App\Models\User::ROLE_LIVREUR)->get();

        if ($livreurs->isEmpty()) {
            $this->command->info('No livreur users found. Skipping document creation.');
            return;
        }

        $livreurs->each(function (\App\Models\User $user) {
            \App\Models\Livreur_document::factory()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
