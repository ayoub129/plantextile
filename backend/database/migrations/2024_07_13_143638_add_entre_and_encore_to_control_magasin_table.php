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
        Schema::table('control_magasin', function (Blueprint $table) {
            $table->integer('entre')->default(0);
            $table->integer('encore')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('control_magasin', function (Blueprint $table) {
            $table->dropColumn(['entre', 'encore']);
        });
    }
};
