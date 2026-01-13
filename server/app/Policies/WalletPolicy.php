<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Auth\Access\Response;

class WalletPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Wallet $wallet): bool
    {
        return $user->isAdmin() || $user->id === $wallet->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Wallet $wallet): bool
    {
        return $user->isAdmin() || $user->id === $wallet->user_id;
    }

    public function delete(User $user, Wallet $wallet): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Wallet $wallet): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Wallet $wallet): bool
    {
        return $user->isAdmin();
    }
} 
