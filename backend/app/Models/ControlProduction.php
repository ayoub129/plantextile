<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'chain_id',
        'value',
        'retouch',
        'posts'
    ];

    public function model()
    {
        return $this->belongsTo(Models::class);
    }

    public function chain()
    {
        return $this->belongsTo(Chains::class);
    }
}
