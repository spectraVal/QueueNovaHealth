<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        /**
         * Data dokter dummy.
         * Sesuai ERD Register Doctor:
         * - INSERT INTO users (role: doctor, status: active)
         * - INSERT INTO doctors (user_id, department_id, name, specialization,
         *     sip_number, birth_date, gender, doctor_status default: active)
         *
         * department_id mengikuti urutan DepartmentSeeder:
         *   1=Poli Umum, 2=Poli Jantung, 3=Poli Anak, 4=Poli Kandungan,
         *   5=Poli Saraf, 6=Poli Kulit, 7=Poli Gigi, 8=Poli Mata
         */
        $doctors = [
            // ── Poli Umum ─────────────────────────────────────────────────────
            [
                'email'          => 'dr.budi@novahealth.com',
                'name'           => 'dr. Budi Santoso',
                'specialization' => 'Dokter Umum',
                'sip_number'     => 'SIP-001/2020',
                'birth_date'     => '1980-03-15',
                'gender'         => 'laki-laki',
                'department_id'  => 1,
            ],
            [
                'email'          => 'dr.sari@novahealth.com',
                'name'           => 'dr. Sari Dewi',
                'specialization' => 'Dokter Umum',
                'sip_number'     => 'SIP-002/2020',
                'birth_date'     => '1985-07-22',
                'gender'         => 'perempuan',
                'department_id'  => 1,
            ],
            // ── Poli Jantung ──────────────────────────────────────────────────
            [
                'email'          => 'dr.andi@novahealth.com',
                'name'           => 'dr. Andi Wijaya, Sp.JP',
                'specialization' => 'Kardiologi',
                'sip_number'     => 'SIP-003/2019',
                'birth_date'     => '1975-11-08',
                'gender'         => 'laki-laki',
                'department_id'  => 2,
            ],
            // ── Poli Anak ─────────────────────────────────────────────────────
            [
                'email'          => 'dr.maya@novahealth.com',
                'name'           => 'dr. Maya Putri, Sp.A',
                'specialization' => 'Pediatri',
                'sip_number'     => 'SIP-004/2021',
                'birth_date'     => '1983-05-30',
                'gender'         => 'perempuan',
                'department_id'  => 3,
            ],
            // ── Poli Kandungan ────────────────────────────────────────────────
            [
                'email'          => 'dr.nina@novahealth.com',
                'name'           => 'dr. Nina Rahayu, Sp.OG',
                'specialization' => 'Obstetri & Ginekologi',
                'sip_number'     => 'SIP-005/2018',
                'birth_date'     => '1978-09-14',
                'gender'         => 'perempuan',
                'department_id'  => 4,
            ],
            // ── Poli Saraf ────────────────────────────────────────────────────
            [
                'email'          => 'dr.rizal@novahealth.com',
                'name'           => 'dr. Rizal Firmansyah, Sp.S',
                'specialization' => 'Neurologi',
                'sip_number'     => 'SIP-006/2017',
                'birth_date'     => '1972-12-01',
                'gender'         => 'laki-laki',
                'department_id'  => 5,
            ],
            // ── Poli Kulit ────────────────────────────────────────────────────
            [
                'email'          => 'dr.lina@novahealth.com',
                'name'           => 'dr. Lina Kusuma, Sp.KK',
                'specialization' => 'Dermatologi',
                'sip_number'     => 'SIP-007/2022',
                'birth_date'     => '1990-02-18',
                'gender'         => 'perempuan',
                'department_id'  => 6,
            ],
            // ── Poli Gigi ─────────────────────────────────────────────────────
            [
                'email'          => 'drg.hendra@novahealth.com',
                'name'           => 'drg. Hendra Pratama',
                'specialization' => 'Kedokteran Gigi',
                'sip_number'     => 'SIP-008/2020',
                'birth_date'     => '1987-06-25',
                'gender'         => 'laki-laki',
                'department_id'  => 7,
            ],
            // ── Poli Mata ─────────────────────────────────────────────────────
            [
                'email'          => 'dr.rini@novahealth.com',
                'name'           => 'dr. Rini Oktavia, Sp.M',
                'specialization' => 'Oftalmologi',
                'sip_number'     => 'SIP-009/2019',
                'birth_date'     => '1981-04-10',
                'gender'         => 'perempuan',
                'department_id'  => 8,
            ],
        ];

        foreach ($doctors as $data) {
            // Step 1: INSERT INTO users (role: doctor, status: active)
            $userId = DB::table('users')->insertGetId([
                'email'      => $data['email'],
                'password'   => Hash::make('password123'),
                'role'       => 'doctor',
                'status'     => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // Step 2: INSERT INTO doctors
            DB::table('doctors')->insert([
                'user_id'        => $userId,
                'department_id'  => $data['department_id'],
                'name'           => $data['name'],
                'specialization' => $data['specialization'],
                'sip_number'     => $data['sip_number'],
                'birth_date'     => $data['birth_date'],
                'gender'         => $data['gender'],
                'doctor_status'  => 'active',
                'created_at'     => $now,
                'updated_at'     => $now,
            ]);
        }

        $this->command->info('✅ DoctorSeeder: ' . count($doctors) . ' dokter berhasil dibuat.');
    }
}
