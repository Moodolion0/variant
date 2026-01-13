<?php

namespace App\Services;

use App\Models\Order_item;

class OrderItemService
{
    public function paginate($perPage = 15)
    {
        return Order_item::with(['order','product'])->paginate($perPage);
    }

    public function create(array $data): Order_item
    {
        return Order_item::create([
            'order_id' => $data['order_id'],
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'price_at_purchase' => $data['price_at_purchase'],
        ]);
    }

    public function update(Order_item $item, array $data): Order_item
    {
        $item->fill(array_filter([
            'product_id' => $data['product_id'] ?? null,
            'quantity' => $data['quantity'] ?? null,
            'price_at_purchase' => $data['price_at_purchase'] ?? null,
        ], fn($v) => !is_null($v)));

        $item->save();

        return $item;
    }

    public function delete(Order_item $item): bool
    {
        return $item->delete();
    }
}
