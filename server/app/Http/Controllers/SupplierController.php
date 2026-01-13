<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\SupplierStoreRequest;
use App\Http\Requests\SupplierUpdateRequest;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;

class SupplierController extends Controller
{
    protected SupplierService $service;

    public function __construct(SupplierService $service)
    {
        $this->service = $service;
        $this->authorizeResource(Supplier::class, 'supplier');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Supplier::class);
        $suppliers = Supplier::paginate();

        return response()->json($suppliers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SupplierStoreRequest $request): JsonResponse
    {
        $this->authorize('create', Supplier::class);
        $supplier = $this->service->create($request->validated());

        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier): JsonResponse
    {
        $this->authorize('view', $supplier);
        return response()->json($supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SupplierUpdateRequest $request, Supplier $supplier): JsonResponse
    {
        $this->authorize('update', $supplier);
        $supplier = $this->service->update($supplier, $request->validated());

        return response()->json($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier): JsonResponse
    {
        $this->authorize('delete', $supplier);
        $this->service->delete($supplier);

        return response()->json(null, 204);
    }
}
