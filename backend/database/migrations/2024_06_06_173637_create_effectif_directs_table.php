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
        Schema::create('effectif_directs', function (Blueprint $table) {
            $table->id();
            $table->string('modele')->nullable();
            $table->string('chain')->nullable();
            $table->integer('machinistes')->nullable();
            $table->integer('machinistes_stagiaires')->nullable();
            $table->integer('repassage_preparation')->nullable();
            $table->integer('trassage')->nullable();
            $table->integer('transport')->nullable();
            $table->integer('chef')->nullable();
            $table->integer('machines_speciales')->nullable();
            $table->integer('trassage_special')->nullable();
            $table->integer('controle_table')->nullable();
            $table->integer('controle_final')->nullable();
            $table->integer('machinistes_retouche')->nullable();
            $table->integer('repassage_final')->nullable();
            $table->integer('finition')->nullable();
            $table->integer('transp_fin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('effectif_directs');
    }
};
