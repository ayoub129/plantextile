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
        Schema::create('system_constants', function (Blueprint $table) {
            $table->id();
            $table->double('Nombre_d_heures_par_jour');
            $table->double('Taux_horaire_SMIG_16_29');
            $table->double('Taux_horaire_17_00');
            $table->double('Taux_horaire_17_50');
            $table->double('Masse_salariale_16_29');
            $table->double('Masse_salariale_17_00');
            $table->double('Masse_salariale_17_50');
            $table->double('Capacité_par_unité_transport');
            $table->double('cotisation_entroprise_trans');
            $table->double('Total_prime_par_modèle');
            $table->double('Coût_par_trajet');
            $table->double('Coût_énergie_journalier');
            $table->double('Coût_charges_fixes_journalier');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_constants');
    }
};
