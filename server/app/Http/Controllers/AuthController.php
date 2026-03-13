<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();
        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,client,livreur,fournisseur',
        ]);

        $user = User::create([
            'full_name' => $data['name'],
            'email' => $data['email'],
            'phone_number' => $data['phone'] ?? null,
            'password' => $data['password'], // Utiliser 'password' pour déclencher le mutateur de hachage
            'role' => $data['role'],
            'status' => $data['role'] === 'livreur' ? 'en_attente' : 'valide', // Les livreurs doivent être validés
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function allUsers()
    {
        $this->authorize('viewAny', User::class);

        return response()->json(User::paginate());
    }

    /**
     * Store a new user (admin only)
     */
    public function storeUser(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,livreur,client,fournisseur',
        ]);

        $user = User::create([
            'full_name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => $validated['password'], // Will be hashed by mutator
            'role' => $validated['role'],
            'status' => User::STATUS_VALIDE,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Debug: Create or reset admin user
     */
    public function resetAdminUser()
    {
        // Delete existing admin
        User::where('email', 'admin@example.com')->delete();

        // Create new admin with correct password hashing
        $admin = User::create([
            'full_name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password', // This will be hashed by the mutator
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_VALIDE,
        ]);

        return response()->json([
            'message' => 'Admin user created successfully',
            'user' => $admin,
            'test_credentials' => [
                'email' => 'admin@example.com',
                'password' => 'password',
            ],
        ]);
    }
}
