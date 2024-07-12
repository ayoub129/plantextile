<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemConstant extends Model
{
    use HasFactory;

    protected $fillable = [
        'Nombre_d_heures_par_jour',
        'Taux_horaire_SMIG_16_29',
        'Taux_horaire_17_00',
        'Taux_horaire_17_50',
        'Masse_salariale_16_29',
        'Masse_salariale_17_00',
        'Masse_salariale_17_50',
        'Capacité_par_unité_transport' ,
        'cotisation_entroprise_trans',
        'Coût_énergie_journalier' ,
        'Coût_par_trajet',
        'Coût_charges_fixes_journalier' ,
        'Total_prime_par_modèle',
];

    public function effectifFix()
    {
        return $this->hasMany(EffectifFix::class);
    }

}
