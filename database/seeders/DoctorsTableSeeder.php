<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DoctorsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('doctors')->insert([
            [
                'name' => 'Dr. Budi Santoso',
                'specialization' => 'Dokter Umum',
                'bio' => 'Berpengalaman 10 tahun dalam penanganan penyakit umum dan konsultasi kesehatan keluarga.',
                'profile_picture_url' => 'https://purimedika.com/wp-content/uploads/2020/11/Dr-Lestari-Raharjo.jpg',
                'latitude' => -7.7725,
                'longitude' => 110.3775,
                'address' => 'Jl. Contoh No. 10, Yogyakarta',
                'phone_number' => '081234567890',
                'email' => 'budi.santoso@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Ayu Lestari',
                'specialization' => 'Spesialis Anak',
                'bio' => 'Fokus pada tumbuh kembang anak dan imunisasi.',
                'profile_picture_url' => 'https://purimedika.com/wp-content/uploads/2024/07/dr-shweta.jpg',
                'latitude' => -7.7850,
                'longitude' => 110.3850,
                'address' => 'Jl. Mawar No. 5, Sleman',
                'phone_number' => '081122334455',
                'email' => 'ayu.lestari@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Chandra Wijaya',
                'specialization' => 'Spesialis Kulit dan Kelamin',
                'bio' => 'Ahli dalam dermatologi kosmetik dan penyakit kulit.',
                'profile_picture_url' => 'https://purimedika.com/wp-content/uploads/2020/11/Dr-Ahmad-Nazibullah-Irzy.jpg',
                'latitude' => -7.7900,
                'longitude' => 110.3600,
                'address' => 'Jl. Raya Utama No. 20, Bantul',
                'phone_number' => '085098765432',
                'email' => 'chandra.wijaya@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Siti Rahayu',
                'specialization' => 'Spesialis Jantung',
                'bio' => 'Ahli bedah jantung dengan pengalaman lebih dari 15 tahun di rumah sakit terkemuka.',
                'profile_picture_url' => 'https://purimedika.com/wp-content/uploads/2024/12/dr-savira.jpg',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'address' => 'Jl. Sudirman No. 1, Jakarta Pusat',
                'phone_number' => '081345678901',
                'email' => 'siti.rahayu@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Agus Wijaya',
                'specialization' => 'Dokter Gigi',
                'bio' => 'Praktik umum dan kosmetik gigi untuk senyum sehat Anda.',
                'profile_picture_url' => 'https://purimedika.com/wp-content/uploads/2020/11/Dr-Luthfi-Saad.jpg',
                'latitude' => -7.2575,
                'longitude' => 112.7522,
                'address' => 'Jl. Raya Darmo No. 50, Surabaya',
                'phone_number' => '081567890123',
                'email' => 'agus.wijaya@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Lina Cahyani',
                'specialization' => 'Spesialis Mata',
                'bio' => 'Fokus pada kesehatan mata dan penanganan masalah penglihatan.',
                'profile_picture_url' => 'https://purimedika.com/wp-content/uploads/2020/11/Dr-Thea-Tania.jpg',
                'latitude' => -8.6750,
                'longitude' => 115.2167,
                'address' => 'Jl. Sunset Road No. 7, Denpasar, Bali',
                'phone_number' => '081789012345',
                'email' => 'lina.cahyani@example.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
