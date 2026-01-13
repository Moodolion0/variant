<?php

namespace App\Policies;

use App\Models\Order_item;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Order_item $orderItem): bool
    {
        // Admins, order owner, or assigned livreur can view
        return $user->isAdmin() || $user->id === $orderItem->order->client_id || $user->id === $orderItem->order->livreur_id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Order_item $orderItem): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Order_item $orderItem): bool
    {
        return $user->isAdmin();
    }
}
