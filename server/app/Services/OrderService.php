<?php

namespace App\Services;

use App\Models\Order;

class OrderService
{
    public function paginate($perPage = 15)
    {
        return Order::with(['client','livreur','items'])->paginate($perPage);
    }

    public function create(array $data): Order
    {
        // Ensure status default
        $data['status'] = $data['status'] ?? Order::STATUS_EN_ATTENTE;

        return Order::create([
            'client_id' => $data['client_id'] ?? auth()->id(),
            'livreur_id' => $data['livreur_id'] ?? null,
            'status' => $data['status'],
            'delivery_lat' => $data['delivery_lat'] ?? null,
            'delivery_long' => $data['delivery_long'] ?? null,
            'total_price' => $data['total_price'] ?? 0,
            'delivery_fee' => $data['delivery_fee'] ?? 0,
            'declared_finished_at' => $data['declared_finished_at'] ?? null,
            'confirmed_at' => $data['confirmed_at'] ?? null,
        ]);
    }

    public function update(Order $order, array $data): Order
    {
        $order->fill(array_filter([
            'livreur_id' => $data['livreur_id'] ?? null,
            'status' => $data['status'] ?? null,
            'delivery_lat' => $data['delivery_lat'] ?? null,
            'delivery_long' => $data['delivery_long'] ?? null,
            'total_price' => $data['total_price'] ?? null,
            'delivery_fee' => $data['delivery_fee'] ?? null,
            'declared_finished_at' => $data['declared_finished_at'] ?? null,
            'confirmed_at' => $data['confirmed_at'] ?? null,
        ], fn($v) => !is_null($v)));

        $order->save();

        return $order;
    }

    public function delete(Order $order): bool
    {
        return $order->delete();
    }
}
