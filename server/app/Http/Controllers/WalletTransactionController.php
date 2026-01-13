<?php

namespace App\Http\Controllers;

use App\Models\Wallet_transaction;
use App\Http\Requests\StoreWallet_transactionRequest;
use App\Http\Requests\UpdateWallet_transactionRequest;

class WalletTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWallet_transactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Wallet_transaction $wallet_transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wallet_transaction $wallet_transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWallet_transactionRequest $request, Wallet_transaction $wallet_transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wallet_transaction $wallet_transaction)
    {
        //
    }
}
