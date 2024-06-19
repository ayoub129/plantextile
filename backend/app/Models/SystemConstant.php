<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemConstant extends Model
{
    use HasFactory;

    protected $fillable = [
        'Taux_horaire_SMIG_16,29',
        'Taux_horaire_17,00',
        'Taux_horaire_17,50',
        'Masse_salariale_16,29',
        'Masse_salariale_17.00',
        'Masse_salariale_17.50',
        'Capacité_par_unité_transport' ,
        'Coût_par_trajet',
        'Coût_énergie_journalier' ,
        'Coût_charges_fixes_journalier' ,
        'Coupe',
        'Production',
        'Repassage_final',
        'Contrôle_final',
        'Magasin_final',
        'Magasin_fournitures',
        'Achats_Logistique',
        'Transit',
        'Comptabilité_Finances',
        'RH',
        'Ménage'
];

    public function effectifFix()
    {
        return $this->hasMany(EffectifFix::class);
    }

}
