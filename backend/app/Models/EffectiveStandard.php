<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EffectiveStandard extends Model
{
    use HasFactory;

    protected $fillable = [
        'chain', 'model', 'start_date', 'end_date', 'cointa', 'price_by_part'
    ];

    public function effectifDirects()
    {
        return $this->hasMany(EffectifDirect::class);
    }

    public function effectifIndirects()
    {
        return $this->hasMany(EffectifIndirect::class);
    }

}
