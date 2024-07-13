<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlMagasin extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'value',
        'entre',
        'encore'
    ];

    public function model()
    {
        return $this->belongsTo(Models::class);
    }
}
