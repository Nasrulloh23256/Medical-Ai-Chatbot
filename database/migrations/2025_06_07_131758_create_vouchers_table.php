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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Kode voucher yang unik
            $table->timestamp('expires_at')->nullable(); // Kapan voucher kedaluwarsa (opsional)
            $table->boolean('is_used')->default(false); // Status voucher sudah digunakan atau belum
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Pengguna yang menggunakan voucher
            $table->timestamp('used_at')->nullable(); // Kapan voucher digunakan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};