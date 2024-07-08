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
            $table->foreignId('effective_standard_id')->nullable()->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('effectif_indirects', function (Blueprint $table) {
            $table->dropForeign(['effective_standard_id']);
            $table->dropColumn('effective_standard_id');
        });
    }
};
