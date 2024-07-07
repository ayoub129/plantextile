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
        Schema::create('effectif_indirects', function (Blueprint $table) {
            $table->id();
            $table->integer('coupe')->nullable();
            $table->integer('matlasseurs')->nullable();
            $table->integer('coupeurs')->nullable();
            $table->integer('tiquitage')->nullable();
            $table->integer('vesline')->nullable();
            $table->integer('mag_four')->nullable();
            $table->integer('mag_fin')->nullable();
            $table->integer('machines_sp_manuelle')->nullable();
            $table->integer('cont_fin')->nullable();
            $table->integer('mach_retouche')->nullable();
            $table->integer('repassage')->nullable();
            $table->integer('gabaret')->nullable();
            $table->integer('preparation_stagieres')->nullable();
            $table->integer('preparation')->nullable();
            $table->integer('preparation_elastique')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('effectif_indirects');
    }
};
