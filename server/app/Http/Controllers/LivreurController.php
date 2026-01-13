<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Order;

class LivreurController extends Controller
{
    // Return wallet history for connected livreur
    public function walletHistory()
    {
        $this->authorize('view', Wallet::class);

        $wallet = Wallet::where('user_id', auth()->id())->with('transactions')->first();

        return response()->json($wallet);
    }

    public function requestWithdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        // Placeholder: create a withdraw request / transaction
        return response()->json(['message' => 'Withdraw request received'], 201);
        $amount = $request->input('amount');
        $wallet = Wallet::where('user_id', auth()->id())->firstOrFail();

        if ($wallet->balance < $amount) {
            return response()->json(['message' => 'Solde insuffisant'], 400);
        }

        $wallet->decrement('balance', $amount);
        
        $wallet->transactions()->create(['amount' => -$amount, 'type' => 'withdrawal', 'description' => 'Demande de retrait']);

        return response()->json(['message' => 'Retrait effectué', 'balance' => $wallet->balance], 201);
    }

    public function uploadDocs(Request $request)
    {
        $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'file|max:10240',
        ]);

        // Placeholder: store documents and create LivreurDocument entries
        return response()->json(['message' => 'Documents uploaded'], 201);
    }

    public function checkStatus()
    {
        $user = auth()->user();
        // Placeholder - return basic status
        return response()->json(['status' => $user->status ?? null]);
    }

    // Admin endpoints
    public function pendingLivreurs()
    {
        $this->authorize('viewAny', User::class);

        $pending = User::where('role', User::ROLE_LIVREUR)->where('status', User::STATUS_EN_ATTENTE)->get();

        return response()->json($pending);
    }

    public function validateLivreur($id)
    {
        $this->authorize('update', User::class);

        $user = User::where('id', $id)->where('role', User::ROLE_LIVREUR)->firstOrFail();
        $user->status = User::STATUS_VALIDE;
        $user->save();

        return response()->json($user);
    }
}
