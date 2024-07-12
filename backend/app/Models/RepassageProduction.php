<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RepassageProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'value',
    ];

    public function model()
    {
        return $this->belongsTo(Models::class);
    }

}
