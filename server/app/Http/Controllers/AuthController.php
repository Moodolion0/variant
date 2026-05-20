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
            \Log::debug('Login failed', ['email' => $data['email'], 'user_found' => !!$user]);
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        \Log::debug('User found', ['user_id' => $user->id, 'role' => $user->role, 'tokens_count' => $user->tokens()->count()]);

        $tokenResult = $user->createToken('api-token');
        \Log::debug('Token created', [
            'token_class' => get_class($tokenResult),
            'has_accessToken' => property_exists($tokenResult, 'accessToken'),
            'has_plainTextToken' => property_exists($tokenResult, 'plainTextToken'),
            'plainTextToken_type' => is_object($tokenResult->plainTextToken) ? get_class($tokenResult->plainTextToken) : gettype($tokenResult->plainTextToken),
            'plainTextToken_value' => is_string($tokenResult->plainTextToken) ? $tokenResult->plainTextToken : json_encode($tokenResult->plainTextToken),
        ]);

        // In Sanctum 4.x, plainTextToken is a PersonalAccessTokenResult object, not a string
        $plainToken = is_object($tokenResult->plainTextToken) ? $tokenResult->plainTextToken->token : $tokenResult->plainTextToken;

        return response()->json(['token' => $plainToken, 'user' => $user]);
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

        $tokenResult = $user->createToken('api-token');
        // In Sanctum 4.x, plainTextToken is a PersonalAccessTokenResult object
        $plainToken = is_object($tokenResult->plainTextToken) ? $tokenResult->plainTextToken->token : $tokenResult->plainTextToken;

        return response()->json(['token' => $plainToken, 'user' => $user], 201);
    }

    public function allUsers()
    {
        return response()->json(User::paginate());
    }

    /**
     * Store a new user (admin only)
     */
    public function storeUser(Request $request)
    {
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
            'phone_number' => $validated['phone'] ?? null,
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
