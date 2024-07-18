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
        Schema::create('plastique_fils', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('model_id');
            $table->integer('plastique_real');
            $table->integer('fil_real');
            $table->timestamps();
            $table->foreign('model_id')->references('id')->on('models')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plastique_fils');
    }
};
