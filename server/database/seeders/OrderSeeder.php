<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = User::where('role', 'client')->get();
        $livreurs = User::where('role', 'livreur')->where('status', 'valide')->get();
        
        if ($clients->isEmpty()) {
            $this->command->info('No clients found. Run UserSeeder first.');
            return;
        }

        $statuses = [
            Order::STATUS_EN_ATTENTE,
            Order::STATUS_PAYE,
            Order::STATUS_EN_COURS_LIVRAISON,
            Order::STATUS_LIVRE,
            Order::STATUS_TERMINE,
        ];

        $orders = [
            ['client' => $clients->random(), 'status' => Order::STATUS_EN_ATTENTE, 'total' => 89.99, 'delivery_fee' => 5.00],
            ['client' => $clients->random(), 'status' => Order::STATUS_PAYE, 'total' => 249.99, 'delivery_fee' => 5.00],
            ['client' => $clients->random(), 'status' => Order::STATUS_EN_COURS_LIVRAISON, 'total' => 159.99, 'delivery_fee' => 5.00, 'livreur' => $livreurs->random()],
            ['client' => $clients->random(), 'status' => Order::STATUS_LIVRE, 'total' => 79.99, 'delivery_fee' => 5.00, 'livreur' => $livreurs->random()],
            ['client' => $clients->random(), 'status' => Order::STATUS_TERMINE, 'total' => 449.99, 'delivery_fee' => 5.00, 'livreur' => $livreurs->random()],
            ['client' => $clients->random(), 'status' => Order::STATUS_TERMINE, 'total' => 129.99, 'delivery_fee' => 5.00, 'livreur' => $livreurs->random()],
            ['client' => $clients->random(), 'status' => Order::STATUS_EN_ATTENTE, 'total' => 59.99, 'delivery_fee' => 5.00],
            ['client' => $clients->random(), 'status' => Order::STATUS_PAYE, 'total' => 199.99, 'delivery_fee' => 5.00],
        ];

        foreach ($orders as $orderData) {
            $order = Order::create([
                'client_id' => $orderData['client']->id,
                'livreur_id' => isset($orderData['livreur']) ? $orderData['livreur']->id : null,
                'status' => $orderData['status'],
                'total_price' => $orderData['total'],
                'delivery_fee' => $orderData['delivery_fee'],
                'delivery_lat' => 5.3601 + (rand(-100, 100) / 10000),
                'delivery_long' => -4.0083 + (rand(-100, 100) / 10000),
            ]);

            // Add order items
            $this->createOrderItems($order, $orderData['total']);
        }

        $this->command->info('Orders seeded successfully!');
    }

    private function createOrderItems(Order $order, float $total)
    {
        $products = \App\Models\Product::inRandomOrder()->take(rand(1, 3))->get();
        $remaining = $total;

        foreach ($products as $index => $product) {
            $isLast = $index === $products->count() - 1;
            $quantity = rand(1, 3);
            $price = $product->getFinalPrice();
            
            if ($isLast) {
                $price = $remaining;
            } else {
                $remaining -= $price * $quantity;
            }

            \App\Models\Order_item::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price_at_purchase' => $price,
            ]);
        }
    }
}
