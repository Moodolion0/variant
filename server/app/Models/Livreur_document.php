<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Livreur_document extends Model
{
    /** @use HasFactory<\\Database\\Factories\\LivreurDocumentFactory> */
    use HasFactory;

    public const STATUS_EN_ATTENTE = 'en_attente';
    public const STATUS_APPROUVE = 'approuve';
    public const STATUS_REJETE = 'rejete';

    protected $fillable = [
        'user_id',
        'doc_type',
        'file_url',
        'status',
        'admin_note',
    ];

    protected $casts = [
        'user_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROUVE;
    }
}
