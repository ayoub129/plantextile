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
        Schema::table('chain_productions', function (Blueprint $table) {
            $table->integer('entre')->default(0);
            $table->integer('sortie')->default(0);
            $table->renameColumn('value', 'production');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chain_productions', function (Blueprint $table) {
            $table->dropColumn(['entre', 'sortie']);
            $table->renameColumn('production', 'value');
        });
    }
};
