<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('effective_reals', function (Blueprint $table) {
            $table->id();
            $table->string('chain');
            $table->string('model');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('cointa');
            $table->decimal('price_by_part', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('effective_reals');
    }
};