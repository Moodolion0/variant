<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function create(array $data): User
    {
        return User::create([
            'full_name' => $data['full_name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'password' => $data['password'] ?? bcrypt('password'), // Utiliser 'password' pour déclencher le mutateur
            'role' => $data['role'] ?? User::ROLE_CLIENT,
            'status' => $data['status'] ?? User::STATUS_EN_ATTENTE,
        ]);
    }

    public function update(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $user->password = $data['password'];
        }

        $user->fill(array_filter([
            'full_name' => $data['full_name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'role' => $data['role'] ?? null,
            'status' => $data['status'] ?? null,
        ], fn($v) => !is_null($v)));

        $user->save();

        return $user;
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}
