<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Khalid',
            'email' => 'Khalid@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);

        User::create([
            'name' => 'Developer',
            'email' => 'developer@example.com',
            'password' => Hash::make('devpassword'),
            'role' => 'developer',
        ]);
    }
}
