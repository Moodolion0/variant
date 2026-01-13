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
        // Ensure users exist
        if (\App\Models\User::count() === 0) {
            \App\Models\User::factory(5)->create();
        }

        \App\Models\User::inRandomOrder()->take(5)->each(function (\App\Models\User $user) {
            \App\Models\Livreur_document::factory()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
