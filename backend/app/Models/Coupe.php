<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupe extends Model
{
    use HasFactory;

    protected $fillable = [
        'effectif_indirect_id', 'matlasseurs', 'coupeurs', 'tiquitage', 'vesline'
    ];

    public function effectifIndirect()
    {
        return $this->belongsTo(EffectifIndirect::class);
    }
}
