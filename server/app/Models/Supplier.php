<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    /** @use HasFactory<\\Database\\Factories\\SupplierFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'latitude',
        'longitude',
        'address_text',
        'email',
        'phone',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Relation vers l'utilisateur fournisseur
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Relation vers les produits du fournisseur
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope a query to suppliers within a radius (km) of given lat/lng.
     */
    public function scopeNearby($query, float $lat, float $lng, float $radiusKm = 1.0)
    {
        // Haversine formula approximation
        $haversine = "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(latitude))))";

        return $query->select('*')
            ->selectRaw("{$haversine} AS distance")
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->having('distance', '<=', $radiusKm)
            ->orderBy('distance');
    }
}
