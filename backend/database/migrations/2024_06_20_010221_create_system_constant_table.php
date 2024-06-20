<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_constant', function (Blueprint $table) {
            $table->id();
            $table->integer('Nombre_d_heures_par_jour');
            $table->integer('Taux_horaire_SMIG_16_29');
            $table->integer('Taux_horaire_17_00');
            $table->integer('Taux_horaire_17_50');
            $table->integer('Masse_salariale_16_29');
            $table->integer('Masse_salariale_17_00');
            $table->integer('Masse_salariale_17_50');
            $table->integer('Capacité_par_unité_transport');
            $table->integer('cotisation_entroprise_trans');
            $table->integer('Total_prime_par_modèle');
            $table->integer('Coût_par_trajet');
            $table->integer('Coût_énergie_journalier');
            $table->integer('Coût_charges_fixes_journalier');
            $table->integer('Coupe');
            $table->integer('Production');
            $table->integer('Repassage_final');
            $table->integer('Contrôle_final');
            $table->integer('Magasin_final');
            $table->integer('Magasin_fournitures');
            $table->integer('Achats_Logistique');
            $table->integer('Transit');
            $table->integer('Comptabilité_Finances');
            $table->integer('RH');
            $table->integer('Ménage');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_constant');
    }
};
