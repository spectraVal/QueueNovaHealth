<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class NurseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        /**
         * Data perawat dummy.
         * Sesuai ERD Register Nurse:
         * - INSERT INTO users (role: nurse, status: active)
         * - INSERT INTO nurses (user_id, department_id, name, sip_number,
         *     birth_date, gender)
         * - department_id nullable (nurse bisa lintas departemen)
         *
         * department_id mengikuti urutan DepartmentSeeder:
         *   1=Poli Umum, 2=Poli Jantung, 3=Poli Anak, 4=Poli Kandungan, dll.
         */
        $nurses = [
            // ── Poli Umum ─────────────────────────────────────────────────────
            [
                'email'         => 'ns.fitri@novahealth.com',
                'name'          => 'Ns. Fitri Handayani, S.Kep',
                'sip_number'    => 'SIPP-001/2021',
                'birth_date'    => '1995-04-12',
                'gender'        => 'perempuan',
                'department_id' => 1,
            ],
            [
                'email'         => 'ns.doni@novahealth.com',
                'name'          => 'Ns. Doni Kurniawan, S.Kep',
                'sip_number'    => 'SIPP-002/2021',
                'birth_date'    => '1993-08-20',
                'gender'        => 'laki-laki',
                'department_id' => 1,
            ],
            // ── Poli Jantung ──────────────────────────────────────────────────
            [
                'email'         => 'ns.yuli@novahealth.com',
                'name'          => 'Ns. Yuli Astuti, S.Kep',
                'sip_number'    => 'SIPP-003/2020',
                'birth_date'    => '1991-01-15',
                'gender'        => 'perempuan',
                'department_id' => 2,
            ],
            // ── Poli Anak ─────────────────────────────────────────────────────
            [
                'email'         => 'ns.toni@novahealth.com',
                'name'          => 'Ns. Toni Setiawan, S.Kep',
                'sip_number'    => 'SIPP-004/2022',
                'birth_date'    => '1997-11-03',
                'gender'        => 'laki-laki',
                'department_id' => 3,
            ],
            // ── Poli Kandungan ────────────────────────────────────────────────
            [
                'email'         => 'ns.eka@novahealth.com',
                'name'          => 'Ns. Eka Wulandari, S.Kep',
                'sip_number'    => 'SIPP-005/2021',
                'birth_date'    => '1994-06-28',
                'gender'        => 'perempuan',
                'department_id' => 4,
            ],
            // ── Lintas Departemen (department_id null) ────────────────────────
            [
                'email'         => 'ns.agus@novahealth.com',
                'name'          => 'Ns. Agus Salim, S.Kep',
                'sip_number'    => 'SIPP-006/2020',
                'birth_date'    => '1989-09-09',
                'gender'        => 'laki-laki',
                'department_id' => null, // nurse lintas departemen
            ],
            [
                'email'         => 'ns.sinta@novahealth.com',
                'name'          => 'Ns. Sinta Permata, S.Kep',
                'sip_number'    => 'SIPP-007/2022',
                'birth_date'    => '1998-03-17',
                'gender'        => 'perempuan',
                'department_id' => null,
            ],
        ];

        foreach ($nurses as $data) {
            // Step 1: INSERT INTO users (role: nurse, status: active)
            $userId = DB::table('users')->insertGetId([
                'email'      => $data['email'],
                'password'   => Hash::make('password123'),
                'role'       => 'nurse',
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // Step 2: INSERT INTO nurses
            DB::table('nurses')->insert([
                'user_id'       => $userId,
                'department_id' => $data['department_id'],
                'name'          => $data['name'],
                'sip_number'    => $data['sip_number'],
                'birth_date'    => $data['birth_date'],
                'gender'        => $data['gender'],
                'created_at'    => $now,
                'updated_at'    => $now,
            ]);
        }

        $this->command->info('✅ NurseSeeder: ' . count($nurses) . ' perawat berhasil dibuat.');
    }
}
