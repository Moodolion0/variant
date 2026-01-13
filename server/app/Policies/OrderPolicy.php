<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        // Admins and livreurs can list orders
        return $user->isAdmin() || $user->role === User::ROLE_LIVREUR;
    }

    public function view(User $user, Order $order): bool
    {
        // Admins, the client who created it, or the assigned livreur can view
        return $user->isAdmin() || $user->id === $order->client_id || $user->id === $order->livreur_id;
    }

    public function create(User $user): bool
    {
        // Any authenticated user (client) can create an order
        return true;
    }

    public function update(User $user, Order $order): bool
    {
        // Admins or the assigned livreur can update (e.g., status/declared_finished_at)
        return $user->isAdmin() || $user->id === $order->livreur_id;
    }

    public function delete(User $user, Order $order): bool
    {
        // Only admins can delete
        return $user->isAdmin();
    }

    public function restore(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }
} 
