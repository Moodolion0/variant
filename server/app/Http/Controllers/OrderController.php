<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Services\OrderService;

class OrderController extends Controller
{
    protected OrderService $service;

    public function __construct(OrderService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->paginate());
    }

    public function store(StoreOrderRequest $request)
    {
        $data = $request->validated();
        $data['client_id'] = auth()->id();

        $order = $this->service->create($data);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order);
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order = $this->service->update($order, $request->validated());

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $this->service->delete($order);

        return response()->json(null, 204);
    }

    // --- Custom endpoints ---
    public function clientOrders()
    {
        $orders = Order::with('items')->where('client_id', auth()->id())->get();

        return response()->json($orders);
    }

    public function confirmReceipt($id)
    {
        $order = Order::where('id', $id)->where('client_id', auth()->id())->firstOrFail();
        $order->status = Order::STATUS_TERMINE;
        $order->confirmed_at = now();
        $order->save();

        return response()->json($order);
    }

    public function availableForLivreur()
    {
        $orders = Order::whereNull('livreur_id')->where('status', Order::STATUS_PAYE)->get();

        return response()->json($orders);
    }

    public function acceptOrder($id)
    {
        $order = Order::where('id', $id)->whereNull('livreur_id')->firstOrFail();
        $order->livreur_id = auth()->id();
        $order->status = Order::STATUS_EN_COURS_LIVRAISON;
        $order->save();

        return response()->json($order);
    }

    public function cancelOrder($id)
    {
        $order = Order::findOrFail($id);
        // business rules for cancellation/penalty should be implemented in service
        $order->status = Order::STATUS_ANNULE;
        $order->save();

        return response()->json($order);
    }

    public function declareFinished($id)
    {
        $order = Order::where('id', $id)->where('livreur_id', auth()->id())->firstOrFail();
        $order->declared_finished_at = now();
        $order->status = Order::STATUS_LIVRE;
        $order->save();

        return response()->json($order);
    }

    public function supplierOrders()
    {
        // Placeholder: return recent orders; refine to filter by supplier products
        $orders = Order::with('items')->latest()->take(50)->get();

        return response()->json($orders);
    }

    public function markAsReady($id)
    {
        $order = Order::findOrFail($id);
        // business rule: mark items / notify livreur : simplified to status change
        $order->status = Order::STATUS_EN_COURS_LIVRAISON;
        $order->save();

        return response()->json($order);
    }

    public function adminStats()
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', Order::STATUS_EN_ATTENTE)->count();
        $inDelivery = Order::where('status', Order::STATUS_EN_COURS_LIVRAISON)->count();
        $completedOrders = Order::where('status', Order::STATUS_LIVRE)->count();

        // Calculate total sales
        $totalSales = Order::where('status', Order::STATUS_LIVRE)->sum('total_price');

        // Get user counts
        $totalClients = \App\Models\User::where('role', \App\Models\User::ROLE_CLIENT)->count();
        $totalLivreurs = \App\Models\User::where('role', \App\Models\User::ROLE_LIVREUR)->count();

        // Get product count
        $totalProducts = \App\Models\Product::count();

        return response()->json([
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'in_delivery' => $inDelivery,
            'completed_orders' => $completedOrders,
            'total_sales' => $totalSales,
            'total_clients' => $totalClients,
            'total_livreurs' => $totalLivreurs,
            'total_products' => $totalProducts,
        ]);
    }

    public function allOrders()
    {
        return response()->json(Order::with(['client','livreur','items'])->paginate());
    }
}
