<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            ['name' => 'Abidjan - Plateau', 'latitude' => 5.3601, 'longitude' => -4.0083],
            ['name' => 'Abidjan - Cocody', 'latitude' => 5.3919, 'longitude' => -3.9903],
            ['name' => 'Abidjan - Marcory', 'latitude' => 5.3093, 'longitude' => -3.9961],
            ['name' => 'Abidjan - Treichville', 'latitude' => 5.3317, 'longitude' => -4.0216],
            ['name' => 'Abidjan - Yopougon', 'latitude' => 5.3266, 'longitude' => -4.0721],
            ['name' => 'Abidjan - Bingerville', 'latitude' => 5.3531, 'longitude' => -3.8936],
            ['name' => 'Abidjan - Port-Bouët', 'latitude' => 5.2547, 'longitude' => -4.0719],
            ['name' => 'Abidjan - Attécoubé', 'latitude' => 5.3264, 'longitude' => -4.0342],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }

        $this->command->info('Locations seeded successfully!');
    }
}
