<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductPlanHoursTable extends Migration
{
    public function up()
    {
        Schema::create('product_plan_hours', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_plan_id');
            $table->string('hour');
            $table->string('day');
            $table->date('date');
            $table->integer('models_finished');
            $table->timestamps();

            $table->foreign('product_plan_id')->references('id')->on('product_plans')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_plan_hours');
    }
}
