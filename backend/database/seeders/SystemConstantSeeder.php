<?php

namespace Database\Seeders;

use App\Models\EffectifFix;
use App\Models\SystemConstant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemConstantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SystemConstant::create([
            'Nombre_d_heures_par_jour' => 9,
            'Taux_horaire_SMIG_16_29' => 19.725561,
            'Taux_horaire_17_00' => 20.5853,
            'Taux_horaire_17_50' => 21.19075,
            'Masse_salariale_16_29' => 60,
            'Masse_salariale_17_00' => 30,
            'Masse_salariale_17_50' => 10,
            'Capacité_par_unité_transport' => 20,
            'cotisation_entroprise_trans' => 80,
            'Coût_énergie_journalier' => 0,
            'Coût_par_trajet' => 65,
            'Coût_charges_fixes_journalier' => 0,
        ]);

        EffectifFix::create([
            'Coupe' => 12,
            'Production' => 12,
            'Repassage_final' => 12,
            'Contrôle_final' => 12,
            'Magasin_final' => 12,
            'Magasin_fournitures' => 12,
            'Achats_Logistique' => 12,
            'Transit' => 12,
            'Comptabilité_Finances' => 12,
            'RH' => 12,
            'Ménage' => 12,
            'Autres' => 12,
            'system_constant_id' => 1
        ]);
    }
}
