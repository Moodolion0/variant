<?php

namespace App\Http\Controllers;

use App\Models\Order_item;
use App\Http\Requests\StoreOrder_itemRequest;
use App\Http\Requests\UpdateOrder_itemRequest;
use App\Services\OrderItemService;

class OrderItemController extends Controller
{
    protected OrderItemService $service;

    public function __construct(OrderItemService $service)
    {
        $this->service = $service;
        $this->authorizeResource(Order_item::class, 'order_item');
    }

    public function index()
    {
        $this->authorize('viewAny', Order_item::class);

        return response()->json($this->service->paginate());
    }

    public function store(StoreOrder_itemRequest $request)
    {
        $this->authorize('create', Order_item::class);

        $item = $this->service->create($request->validated());

        return response()->json($item, 201);
    }

    public function show(Order_item $order_item)
    {
        $this->authorize('view', $order_item);

        return response()->json($order_item);
    }

    public function update(UpdateOrder_itemRequest $request, Order_item $order_item)
    {
        $this->authorize('update', $order_item);

        $item = $this->service->update($order_item, $request->validated());

        return response()->json($item);
    }

    public function destroy(Order_item $order_item)
    {
        $this->authorize('delete', $order_item);

        $this->service->delete($order_item);

        return response()->json(null, 204);
    }
}
