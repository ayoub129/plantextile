<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChainProductionRetouchTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chain_production_retouch', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chain_id')->nullable();
            $table->unsignedBigInteger('model_id');
            $table->integer('value');
            $table->unsignedBigInteger('post_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('chain_id')->references('id')->on('chains')->onDelete('cascade');
            $table->foreign('model_id')->references('id')->on('models')->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chain_production_retouch');
    }
}
