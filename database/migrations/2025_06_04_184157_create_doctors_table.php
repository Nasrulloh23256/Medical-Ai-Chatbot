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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialization', 100)->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_picture_url')->nullable();
            $table->decimal('latitude', 10, 8); // Presisi 10 digit, 8 di antaranya setelah koma
            $table->decimal('longitude', 11, 8); // Presisi 11 digit, 8 di antaranya setelah koma
            $table->string('address')->nullable();
            $table->string('phone_number', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->timestamps(); // Menambahkan created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
