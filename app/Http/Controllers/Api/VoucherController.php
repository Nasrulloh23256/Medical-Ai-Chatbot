<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoucherController extends Controller
{
    /**
     * Menukarkan voucher dan meng-upgrade plan pengguna.
     */
    public function redeem(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'code' => 'required|string|exists:vouchers,code',
        ]);

        // 2. Cari voucher berdasarkan kode
        $voucher = Voucher::where('code', $request->code)->first();

        // 3. Cek apakah voucher valid (belum digunakan)
        if ($voucher->is_used) {
            return response()->json(['message' => 'Voucher has already been used.'], 422);
        }

        // Opsional: Cek apakah voucher sudah kedaluwarsa
        if ($voucher->expires_at && $voucher->expires_at->isPast()) {
            return response()->json(['message' => 'Voucher has expired.'], 422);
        }

        // 4. Update plan pengguna
        $user = Auth::user();
        $user->plan = 'pro';
        $user->save();

        // 5. Tandai voucher sebagai sudah digunakan
        $voucher->is_used = true;
        $voucher->user_id = $user->id;
        $voucher->used_at = now();
        $voucher->save();

        // 6. Beri respons sukses
        return response()->json(['message' => 'Plan upgraded to Pro successfully!']);
    }
}