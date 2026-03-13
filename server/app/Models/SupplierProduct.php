<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'name',
        'description',
        'price',
        'stock_quantity',
        'keywords',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    /**
     * Relation avec le fournisseur
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Relation avec les produits revendus par l'admin
     */
    public function platformProducts()
    {
        return $this->hasMany(Product::class, 'supplier_product_id');
    }

    /**
     * Obtenir le prix du fournisseur
     */
    public function getSupplierPriceAttribute()
    {
        return $this->price;
    }

    /**
     * Relation avec les images du produit
     */
    public function images()
    {
        return $this->hasMany(SupplierProductImage::class);
    }

    /**
     * Obtenir l'URL de l'image principale
     */
    public function getMainImage(): ?string
    {
        $firstImage = $this->images()->first();
        return $firstImage ? $firstImage->file_url : null;
    }

    /**
     * Vérifier si le stock est disponible
     */
    public function hasStock(int $quantity = 1): bool
    {
        return $this->stock_quantity >= $quantity;
    }
}
