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
        Schema::table('effectif_fixes', function (Blueprint $table) {
            $table->foreignId('system_constant_id')->nullable()->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('effectif_fixes', function (Blueprint $table) {
            $table->dropForeign(['system_constant_id']);
            $table->dropColumn('system_constant_id');
        });
    }
};
