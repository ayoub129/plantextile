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
        Schema::create('coupes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('effectif_indirect_id')->constrained()->onDelete('cascade');
            $table->integer('matlasseurs')->nullable();
            $table->integer('coupeurs')->nullable();
            $table->integer('tiquitage')->nullable();
            $table->integer('vesline')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupes');
    }
};
