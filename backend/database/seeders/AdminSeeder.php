<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $admins = [
            [
                'email' => 'admin@novahealth.com',
                'name'  => 'Super Admin',
            ],
            [
                'email' => 'admin.resepsi@novahealth.com',
                'name'  => 'Admin Resepsionis',
            ],
        ];

        foreach ($admins as $data) {
            $userId = DB::table('users')->insertGetId([
                'email'      => $data['email'],
                'password'   => Hash::make('admin123'),
                'role'       => 'admin',
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('admins')->insert([
                'user_id'    => $userId,
                'name'       => $data['name'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command->info('✅ AdminSeeder: ' . count($admins) . ' admin berhasil dibuat.');
    }
}
