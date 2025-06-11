<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['id' => 1, 'name' => 'Super Admin', 'email' => 'superadmin@gmail.com', 'password' => Hash::make('password')],
        ];

        foreach ($users as $user) {
            User::create($user);
            
        }
    }
}
