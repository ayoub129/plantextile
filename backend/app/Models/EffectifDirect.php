<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EffectifDirect extends Model
{
    use HasFactory;

    protected $fillable = [
        'modele' , 'chain' , 'machinistes', 'machinistes_stagiaires', 'repassage_preparation', 
        'trassage', 'transport', 'chef', 'machines_speciales', 'trassage_special', 'controle_table', 
        'controle_final', 'machinistes_retouche', 'repassage_final', 'finition', 'transp_fin'
    ];

    public function effectiveStandard()
    {
        return $this->belongsTo(EffectiveStandard::class);
    }
}
