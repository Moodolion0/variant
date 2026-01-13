<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use App\Services\LocationService;

class LocationController extends Controller
{
    protected LocationService $service;

    public function __construct(LocationService $service)
    {
        $this->service = $service;
        $this->authorizeResource(Location::class, 'location');
    }

    public function index()
    {
        $this->authorize('viewAny', Location::class);
        return response()->json($this->service->paginate());
    }

    public function store(StoreLocationRequest $request)
    {
        $this->authorize('create', Location::class);
        $loc = $this->service->create($request->validated());

        return response()->json($loc, 201);
    }

    public function show(Location $location)
    {
        $this->authorize('view', $location);
        return response()->json($location);
    }

    public function update(UpdateLocationRequest $request, Location $location)
    {
        $this->authorize('update', $location);
        $loc = $this->service->update($location, $request->validated());

        return response()->json($loc);
    }

    public function destroy(Location $location)
    {
        $this->authorize('delete', $location);
        $this->service->delete($location);

        return response()->json(null, 204);
    }

    // User-specific address endpoints
    public function myAddresses()
    {
        // If 'user_id' exists on locations, filter by user — otherwise return empty list
        if (\Illuminate\Support\Facades\Schema::hasColumn('locations', 'user_id')) {
            $addresses = \App\Models\Location::where('user_id', auth()->id())->get();
        } else {
            $addresses = $this->service->paginate();
        }

        return response()->json($addresses);
    }

    public function storeAddress(StoreLocationRequest $request)
    {
        $data = $request->validated();

        if (\Illuminate\Support\Facades\Schema::hasColumn('locations', 'user_id')) {
            $data['user_id'] = auth()->id();
        }

        $loc = $this->service->create($data);

        return response()->json($loc, 201);
    }
} 
