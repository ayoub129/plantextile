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
        Schema::table('effectif_indirects', function (Blueprint $table) {
            $table->dropColumn(['matlasseurs', 'coupeurs', 'tiquitage', 'vesline']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('effectif_indirects', function (Blueprint $table) {
            $table->integer('matlasseurs')->nullable();
            $table->integer('coupeurs')->nullable();
            $table->integer('tiquitage')->nullable();
            $table->integer('vesline')->nullable();
        });
    }
};
