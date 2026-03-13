<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_product_id',
        'file_url',
        'cloudinary_public_id',
        'width',
        'height',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'width' => 'integer',
        'height' => 'integer',
    ];

    /**
     * Relation avec le produit fournisseur
     */
    public function supplierProduct()
    {
        return $this->belongsTo(SupplierProduct::class);
    }
}
