<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@teste.com'],
            [
                'name' => 'Admin Principal',
                'password' => Hash::make('senha1234'),
                'role' => 'admin',
            ]
        );

        User::factory()->count(10)->create(['role' => 'customer']);
    }
}