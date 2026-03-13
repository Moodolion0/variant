<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\\Database\\Factories\\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'supplier_product_id',
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

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Relation avec le produit fournisseur (pour la revente)
     */
    public function supplierProduct()
    {
        return $this->belongsTo(SupplierProduct::class, 'supplier_product_id');
    }

    public function images()
    {
        return $this->hasMany(Product_image::class);
    }

    public function orderItems()
    {
        return $this->hasMany(Order_item::class);
    }

    /**
     * Obtenir le stock (depuis supplier_product si lié, sinon stock local)
     */
    public function getSyncedStock(): int
    {
        if ($this->supplierProduct) {
            return $this->supplierProduct->stock_quantity;
        }
        return $this->stock_quantity;
    }

    /**
     * Obtenir l'URL de l'image principale du produit
     */
    public function getImageAttribute()
    {
        $firstImage = $this->images()->first();
        return $firstImage ? $firstImage->file_url : null;
    }

    /**
     * Obtenir l'image principale (depuis supplier_product si lié, sinon image locale)
     */
    public function getMainImage(): ?string
    {
        // Si lié à un produit fournisseur, utiliser son image
        if ($this->supplierProduct) {
            return $this->supplierProduct->getMainImage();
        }
        // Sinon utiliser l'image locale
        return $this->image;
    }

    /**
     * Vérifier si c'est un produit revendu (liée à supplier_product)
     */
    public function isResaleProduct(): bool
    {
        return $this->supplier_product_id !== null;
    }
}
