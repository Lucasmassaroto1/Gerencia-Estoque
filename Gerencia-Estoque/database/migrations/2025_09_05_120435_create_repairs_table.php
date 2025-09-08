<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up(): void{
    Schema::create('repairs', function (Blueprint $table){
      $table->id();
      $table->foreignId('representative_id')->constrained('users')->cascadeOnDelete();
      $table->foreignId('client_id')->constrained()->cascadeOnDelete();
      $table->string('device')->nullable(); // notebook, desktop etc
      $table->text('problem_description');
      $table->enum('status', ['in_progress','ready','delivered'])->default('in_progress');
      $table->decimal('price',10,2)->nullable();
      $table->timestamp('delivered_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down(): void{
    Schema::dropIfExists('repairs');
  }
};