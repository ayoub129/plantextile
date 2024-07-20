<?php

namespace Database\Seeders;

use App\Models\EffectifFix;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EffectifFixSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
            'system_constant_id' => 2
        ]);
    }
}
