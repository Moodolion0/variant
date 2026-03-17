<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'full_name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_VALIDE,
        ]);

        // Create supplier user
        User::factory()->create([
            'full_name' => 'Supplier User',
            'email' => 'supplier@example.com',
            'password' => 'password',
            'role' => User::ROLE_FOURNISSEUR,
            'status' => User::STATUS_VALIDE,
        ]);

        // Create livreur users
        User::factory(3)->create([
            'role' => User::ROLE_LIVREUR,
            'status' => User::STATUS_VALIDE,
        ]);

        // Create regular users (clients)
        User::factory(5)->create();
    }
}
