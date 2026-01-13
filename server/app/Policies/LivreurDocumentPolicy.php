<?php

namespace App\Policies;

use App\Models\Livreur_document;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LivreurDocumentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Livreur_document $livreurDocument): bool
    {
        return $user->isAdmin() || $user->id === $livreurDocument->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Allow admins and users with role 'livreur' to upload documents
        return $user->isAdmin() || $user->role === 'livreur';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Livreur_document $livreurDocument): bool
    {
        return $user->isAdmin() || $user->id === $livreurDocument->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Livreur_document $livreurDocument): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Livreur_document $livreurDocument): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Livreur_document $livreurDocument): bool
    {
        return $user->isAdmin();
    }
}
