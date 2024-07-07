<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoupeProductionsTable extends Migration
{
    public function up()
    {
        Schema::create('coupe_productions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('model_id')->constrained('models');
            $table->date('day');
            $table->time('hour');
            $table->integer('value');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('coupe_productions');
    }
}
