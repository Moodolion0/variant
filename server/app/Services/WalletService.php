<?php

namespace App\Services;

use App\Models\Wallet;

class WalletService
{
    public function paginate($perPage = 15)
    {
        return Wallet::with('user')->paginate($perPage);
    }

    public function create(array $data): Wallet
    {
        return Wallet::create([
            'user_id' => $data['user_id'],
            'balance' => $data['balance'] ?? 0,
        ]);
    }

    public function update(Wallet $wallet, array $data): Wallet
    {
        $wallet->fill(array_filter([
            'balance' => $data['balance'] ?? null,
        ], fn($v) => !is_null($v)));

        $wallet->save();

        return $wallet;
    }

    public function delete(Wallet $wallet): bool
    {
        return $wallet->delete();
    }
} 