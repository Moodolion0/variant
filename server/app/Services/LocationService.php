<?php

namespace App\Services;

use App\Models\Location;

class LocationService
{
    public function paginate($perPage = 15)
    {
        return Location::paginate($perPage);
    }

    public function create(array $data): Location
    {
        return Location::create([
            'name' => $data['name'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
        ]);
    }

    public function update(Location $location, array $data): Location
    {
        $location->fill(array_filter([
            'name' => $data['name'] ?? null,
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
        ], fn($v) => !is_null($v)));

        $location->save();

        return $location;
    }

    public function delete(Location $location): bool
    {
        return $location->delete();
    }
}
