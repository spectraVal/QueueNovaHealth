<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $patients = [
            [
                'email'      => 'pasien.budi@gmail.com',
                'name'       => 'Budiman Haryono',
                'phone'      => '08111234567',
                'address'    => 'Jl. Melati No.10, Jakarta Selatan',
                'birth_date' => '1990-05-20',
                'gender'     => 'laki-laki',
            ],
            [
                'email'      => 'pasien.ani@gmail.com',
                'name'       => 'Ani Suryani',
                'phone'      => '08122345678',
                'address'    => 'Jl. Kenanga No.5, Depok',
                'birth_date' => '1988-09-14',
                'gender'     => 'perempuan',
            ],
            [
                'email'      => 'pasien.joko@gmail.com',
                'name'       => 'Joko Prabowo',
                'phone'      => '08133456789',
                'address'    => 'Jl. Mawar No.3, Bekasi',
                'birth_date' => '1975-02-28',
                'gender'     => 'laki-laki',
            ],
            [
                'email'      => 'pasien.dewi@gmail.com',
                'name'       => 'Dewi Rahayu',
                'phone'      => '08144567890',
                'address'    => 'Jl. Dahlia No.7, Tangerang',
                'birth_date' => '1995-12-01',
                'gender'     => 'perempuan',
            ],
            [
                'email'      => 'pasien.hasan@gmail.com',
                'name'       => 'Hasan Basri',
                'phone'      => '08155678901',
                'address'    => 'Jl. Cempaka No.2, Bogor',
                'birth_date' => '1960-07-17',
                'gender'     => 'laki-laki',
            ],
            [
                'email'      => 'pasien.rina@gmail.com',
                'name'       => 'Rina Marlina',
                'phone'      => '08166789012',
                'address'    => 'Jl. Anggrek No.15, Jakarta Barat',
                'birth_date' => '2000-03-08',
                'gender'     => 'perempuan',
            ],
            [
                'email'      => 'pasien.fajar@gmail.com',
                'name'       => 'Fajar Nugroho',
                'phone'      => '08177890123',
                'address'    => 'Jl. Tulip No.21, Jakarta Timur',
                'birth_date' => '1982-11-30',
                'gender'     => 'laki-laki',
            ],
            [
                'email'      => 'pasien.siti@gmail.com',
                'name'       => 'Siti Aminah',
                'phone'      => '08188901234',
                'address'    => 'Jl. Flamboyan No.9, Depok',
                'birth_date' => '1970-06-05',
                'gender'     => 'perempuan',
            ],
        ];

        foreach ($patients as $data) {
            $userId = DB::table('users')->insertGetId([
                'email'      => $data['email'],
                'password'   => Hash::make('password123'),
                'role'       => 'patient',
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('patients')->insert([
                'user_id'    => $userId,
                'name'       => $data['name'],
                'phone'      => $data['phone'],
                'address'    => $data['address'],
                'birth_date' => $data['birth_date'],
                'gender'     => $data['gender'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command->info('✅ PatientSeeder: ' . count($patients) . ' pasien berhasil dibuat.');
    }
}
