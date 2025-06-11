<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Mengosongkan tabel terlebih dahulu untuk menghindari duplikasi
        DB::table('vouchers')->delete();

        // Cari satu user untuk di-assign ke voucher yang sudah terpakai
        $firstUser = User::first();

        // Data voucher
        $vouchers = [
            [
                'code' => 'PRO-2025-VALID',
                'is_used' => false,
                'expires_at' => now()->addYear(),
            ],
            [
                'code' => 'PRO-ALREADY-USED',
                'is_used' => true,
                'user_id' => $firstUser ? $firstUser->id : null,
                'used_at' => now()->subDays(10),
                'expires_at' => now()->addYear(),
            ],
            [
                'code' => 'PRO-EXPIRED-CODE',
                'is_used' => false,
                'expires_at' => now()->subDay(),
            ],
        ];

        // **PERBAIKAN:** Gunakan foreach dan create() untuk setiap voucher
        foreach ($vouchers as $voucherData) {
            Voucher::create($voucherData);
        }
    }
}