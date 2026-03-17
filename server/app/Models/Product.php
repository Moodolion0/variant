<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Product Model
 * 
 * Champs fournisseur (immutables après création):
 * - name_supplier: Nom du produit défini par le fournisseur
 * - description_supplier: Description du produit défini par le fournisseur
 * - price_supplier: Prix de base défini par le fournisseur
 * - stock_quantity: Stock total du produit
 * - properties: JSON avec les propriétés (format: {"attribute": {"value": quantity}})
 *   Exemple: {"size": {"S": 10, "M": 15, "L": 25}, "color": {"Red": 5, "Blue": 10}}
 * 
 * Champs admin (modifiables):
 * - name_by_admin: Nom d'affichage au catalogue (priorié sur name_supplier)
 * - description_by_admin: Description d'affichage au catalogue (privé sur description_supplier)
 * - category: Catégorie du produit
 * - interest: Intérêt/markup ajouté au prix (€ ou %)
 * - visible_in_catalog: Visible dans le catalogue client
 * - admin_updated_at: Dernière mise à jour par l'admin
 */
class Product extends Model
{
    /** @use HasFactory<\\Database\\Factories\\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'name_supplier',
        'description_supplier',
        'price_supplier',
        'stock_quantity',
        'name_by_admin',
        'description_by_admin',
        'category',
        'interest',
        'properties',
        'visible_in_catalog',
        'admin_updated_at',
    ];

    protected $casts = [
        'price_supplier' => 'decimal:2',
        'stock_quantity' => 'integer',
        'interest' => 'decimal:2',
        'properties' => 'array',
        'visible_in_catalog' => 'boolean',
        'admin_updated_at' => 'datetime',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
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
     * Obtenir le stock du produit
     */
    public function getSyncedStock(): int
    {
        return $this->stock_quantity;
    }

    /**
     * Obtenir le prix final (prix fournisseur + intérêt de l'admin)
     */
    public function getFinalPrice(): float
    {
        $basePrice = (float) ($this->price_supplier ?? 0);
        $interest = (float) ($this->interest ?? 0);
        return $basePrice + $interest;
    }

    /**
     * Obtenir le nom affiché (priorité à name_by_admin)
     */
    public function getDisplayName(): string
    {
        return $this->name_by_admin ?? $this->name_supplier;
    }

    /**
     * Obtenir la description affichée (priorité à description_by_admin)
     */
    public function getDisplayDescription(): string
    {
        return $this->description_by_admin ?? $this->description_supplier;
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
