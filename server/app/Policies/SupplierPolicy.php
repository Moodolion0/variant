<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SupplierPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // allow public listing; adjust if needed
    }

    public function view(User $user, Supplier $supplier): bool
    {
        return true; // all users can view suppliers
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Supplier $supplier): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, Supplier $supplier): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Supplier $supplier): bool
    {
        return $user->isAdmin();
    }
}
