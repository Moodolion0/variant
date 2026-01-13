<?php

namespace App\Services;

use App\Models\Wallet_transaction;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;

class WalletTransactionService
{
    public function paginate($perPage = 15)
    {
        return Wallet_transaction::with(['user','order'])->paginate($perPage);
    }

    public function create(array $data): Wallet_transaction
    {
        return DB::transaction(function () use ($data) {
            $tx = Wallet_transaction::create([
                'user_id' => $data['user_id'],
                'type' => $data['type'],
                'amount' => $data['amount'],
                'order_id' => $data['order_id'] ?? null,
            ]);

            // Keep wallet balance in sync if a wallet exists
            $wallet = Wallet::firstOrCreate(['user_id' => $data['user_id']], ['balance' => 0]);

            // credit increases balance, retrait decreases, penalite decreases
            if ($data['type'] === 'credit_livraison') {
                $wallet->balance = $wallet->balance + $data['amount'];
            } elseif (in_array($data['type'], ['penalite_annulation','retrait'])) {
                $wallet->balance = max(0, $wallet->balance - $data['amount']);
            }

            $wallet->save();

            return $tx;
        });
    }

    public function delete(Wallet_transaction $tx): bool
    {
        // Consider reversing wallet balance effects if required (not implemented here)
        return $tx->delete();
    }
} 