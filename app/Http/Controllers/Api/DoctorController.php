<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoctorController extends Controller
{
    public function nearby(Request $request)
    {
        $latitude = $request->query('latitude');
        $longitude = $request->query('longitude');
        $city = $request->query('city');

        try {
            if ($latitude && $longitude) {
                $maxDistance = 500; // Maksimum jarak dalam kilometer
                $doctors = DB::select(
                    "SELECT *, (
                        6371 * acos(
                            cos(radians(?)) *
                            cos(radians(latitude)) *
                            cos(radians(longitude) - radians(?)) +
                            sin(radians(?)) *
                            sin(radians(latitude))
                        )
                    ) AS jarak
                    FROM doctors
                    HAVING jarak <= ?
                    ORDER BY jarak
                    LIMIT 5",
                    [$latitude, $longitude, $latitude, $maxDistance]

                );
            } elseif ($city) {
                $doctors = DB::select(
                    "SELECT *, NULL as jarak FROM doctors WHERE bio LIKE ? OR nama LIKE ? LIMIT 5",
                    ["%$city%", "%$city%"]
                );
            } else {
                return response()->json([], 400);
            }

            return response()->json($doctors);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Database error', 'detail' => $e->getMessage()], 500);
        }
    }
}
