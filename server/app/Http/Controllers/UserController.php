<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    protected UserService $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
        $this->authorizeResource(User::class, 'user');
    }

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', User::class);
        $users = User::paginate();

        return response()->json($users);
    }

    public function store(UserStoreRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);
        $user = $this->service->create($request->validated());

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);
        return response()->json($user);
    }

    public function update(UserUpdateRequest $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);
        $user = $this->service->update($user, $request->validated());

        return response()->json($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);
        $this->service->delete($user);

        return response()->json(null, 204);
    }
}
