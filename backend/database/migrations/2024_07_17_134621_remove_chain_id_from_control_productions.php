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
        Schema::table('control_productions', function (Blueprint $table) {
            // Remove the foreign key constraint first
            $table->dropForeign(['chain_id']);
            // Then remove the chain_id column
            $table->dropColumn('chain_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('control_productions', function (Blueprint $table) {
            // Re-add the chain_id column
            $table->foreignId('chain_id')->constrained('chains');
        });
    }
};
