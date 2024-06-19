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
        Schema::create('effective_standards', function (Blueprint $table) {
            $table->id();
            $table->string('chain');
            $table->string('model');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('cointa');
            $table->decimal('price_by_part', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('effective_standard');
    }
};
