<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductPlansTable extends Migration
{
    public function up()
    {
        Schema::create('product_plans', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('qte');
            $table->unsignedBigInteger('model_id');
            $table->string('chain');
            $table->integer('consummation_standard_fil');
            $table->integer('consummation_standard_plastique');
            $table->timestamps();

            $table->foreign('model_id')->references('id')->on('models')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_plans');
    }
}
