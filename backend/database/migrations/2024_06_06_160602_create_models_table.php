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
        Schema::create('models', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('image')->nullable();
            $table->string('categorie');
            $table->string('client');
            $table->integer('quantite_demandee');
            $table->integer('quantite_recue');
            $table->integer('qte_societe');
            $table->decimal('prix_unitaire', 8, 2);
            $table->string('devise');
            $table->date('date_import');
            $table->decimal('cours_devise_import', 8, 4);
            $table->date('date_export')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('models');
    }
};
