<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retouches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('control_production_id');
            $table->unsignedBigInteger('chain_id')->nullable();
            $table->integer('value');
            $table->timestamps();

            $table->foreign('control_production_id')->references('id')->on('control_productions')->onDelete('cascade');
            $table->foreign('chain_id')->references('id')->on('chains')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retouches');
    }
};
