<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlastiqueFil extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'plastique_real',
        'fil_real',
    ];

    public function model()
    {
        return $this->belongsTo(Model::class);
    }
}
