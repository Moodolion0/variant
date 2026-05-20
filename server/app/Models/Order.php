<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\\Database\\Factories\\OrderFactory> */
    use HasFactory;

    public const STATUS_EN_ATTENTE = 'en_attente';
    public const STATUS_PAYE = 'paye';
    public const STATUS_EN_COURS_LIVRAISON = 'en_cours_livraison';
    public const STATUS_LIVRE = 'livre';
    public const STATUS_TERMINE = 'termine';
    public const STATUS_ANNULE = 'annule';

    protected $fillable = [
        'client_id',
        'livreur_id',
        'status',
        'delivery_lat',
        'delivery_long',
        'total_price',
        'delivery_fee',
        'declared_finished_at',
        'confirmed_at',
    ];

    protected $casts = [
        'delivery_lat' => 'float',
        'delivery_long' => 'float',
        'total_price' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'declared_finished_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function livreur()
    {
        return $this->belongsTo(User::class, 'livreur_id');
    }

    public function items()
    {
        return $this->hasMany(Order_item::class);
    }

    /**
     * Scope: commandes assignées au livreur connecté, hors annulées et en attente
     */
    public function scopeForLivreur($query, $livreurId)
    {
        return $query->where('livreur_id', $livreurId)
                     ->whereNotIn('status', [self::STATUS_ANNULE, self::STATUS_EN_ATTENTE])
                     ->orderByDesc('created_at');
    }

    /**
     * Scope: commandes disponibles à livrer (pas de livreur, status=paye)
     */
    public function scopeAvailableForLivreur($query)
    {
        return $query->whereNull('livreur_id')
                     ->where('status', self::STATUS_PAYE)
                     ->orderByDesc('created_at');
    }
} 
