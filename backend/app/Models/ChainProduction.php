<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChainProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'chain',
        'production',
        'entre',
        'sortie',
        'retouch',
        'posts'
    ];

    public function model()
    {
        return $this->belongsTo(Models::class);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }
}
