<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_item extends Model
{
    /** @use HasFactory<\\Database\\Factories\\OrderItemFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_purchase',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price_at_purchase' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Nom du produit au moment de la commande (via la relation Product)
     */
    public function getProductNameAttribute(): string
    {
        if ($this->relationLoaded('product') && $this->product) {
            return $this->product->getDisplayName();
        }
        return 'Produit inconnu';
    }
} 
