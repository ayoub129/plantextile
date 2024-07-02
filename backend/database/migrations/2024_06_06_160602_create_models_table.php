<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModelsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('models', function (Blueprint $table) {
            $table->id();
            $table->string('modele'); // Changed from 'code' to 'modele'
            $table->string('image')->nullable();
            $table->string('category'); // Changed from 'categorie' to 'category'
            $table->string('client');
            $table->integer('quantite_demandee');
            $table->integer('quantityReceived')->nullable(); // Renamed from 'quantite_recue'
            $table->integer('qte_societe');
            $table->decimal('prixMOver', 8, 2);
            $table->string('devise');
            $table->integer('prixFacture');
            $table->string('photos');
            $table->date('dateEtude')->nullable(); // Renamed from 'date_import'
            $table->decimal('cours_devise_etude', 8, 4)->nullable(); // Added nullable
            $table->date('dateImport');
            $table->decimal('cours_devise_import', 8, 4);
            $table->date('dateExport')->nullable();
            $table->decimal('consStandardFil', 8, 2)->nullable(); // Adjusted decimal precision
            $table->decimal('consoStandardPlastique', 8, 2)->nullable(); // Adjusted decimal precision
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('models');
    }
}

