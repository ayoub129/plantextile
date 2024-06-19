<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EffectifIndirect extends Model
{
    use HasFactory;

    protected $fillable = [
        'effective_standard_id', 'mag_four', 'mag_fin', 'machines_sp_manuelle', 'cont_fin', 'mach_retouche', 'repassage', 
        'gabaret', 'preparation_stagieres', 'preparation', 'preparation_elastique'
    ];

    public function effectiveStandard()
    {
        return $this->belongsTo(EffectiveStandard::class);
    }

    public function coupes()
    {
        return $this->hasMany(Coupe::class);
    }
}
