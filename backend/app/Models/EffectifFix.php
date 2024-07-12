<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EffectifFix extends Model
{
    use HasFactory;

    protected $fillable = [
        'coupe', 'Production', 'Repassage_final', 
        'Contrôle_final', 'Magasin_final', 'Magasin_fournitures', 'Achats_Logistique', 'Transit', 'Comptabilité_Finances', 
        'RH', 'Ménage', 'Autres'
    ];

    public function systemConstant()
    {
        return $this->belongsTo(SystemConstant::class);
    }
}
