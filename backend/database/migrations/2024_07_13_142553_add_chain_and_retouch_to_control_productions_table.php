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
            $table->integer('retouch')->default(0)->nullable();
            $table->string('posts')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('control_productions', function (Blueprint $table) {
            $table->dropColumn('retouch');
            $table->dropColumn('posts');
        });
    }
};
