<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChainProductionRetouch extends Model
{
    use HasFactory;

    protected $fillable = [
        'chain_id',
        'model_id',
        'value',
        'post_id',
    ];

    public function chain()
    {
        return $this->belongsTo(Chain::class);
    }

    public function model()
    {
        return $this->belongsTo(Model::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
