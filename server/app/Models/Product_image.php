<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product_image extends Model
{
    /** @use HasFactory<\\Database\\Factories\\ProductImageFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'file_url',
        'cloudinary_public_id',
        'width',
        'height',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
