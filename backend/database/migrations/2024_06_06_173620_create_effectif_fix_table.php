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
        Schema::create('effectif_fix', function (Blueprint $table) {
            $table->id();
            $table->integer('coupe')->nullable();
            $table->integer('Production')->nullable();
            $table->integer('Repassage_final')->nullable();
            $table->integer('Contrôle_final')->nullable();
            $table->integer('Magasin_final')->nullable();
            $table->integer('Magasin_fournitures')->nullable();
            $table->integer('Achats_Logistique')->nullable();
            $table->integer('Transit')->nullable();
            $table->integer('Comptabilité_Finances')->nullable();
            $table->integer('RH')->nullable();
            $table->integer('Ménage')->nullable();
            $table->integer('Autres')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('effectif_fix');
    }
};
