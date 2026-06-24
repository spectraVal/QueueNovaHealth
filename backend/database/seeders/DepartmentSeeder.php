<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $departments = [
            [
                'name'        => 'Poli Umum',
                'description' => 'Pelayanan kesehatan umum untuk semua jenis keluhan dasar.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Jantung',
                'description' => 'Pelayanan diagnosis dan pengobatan penyakit jantung dan kardiovaskular.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Anak',
                'description' => 'Pelayanan kesehatan khusus untuk bayi, anak-anak, dan remaja.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Kandungan',
                'description' => 'Pelayanan kesehatan wanita, kehamilan, dan persalinan.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Saraf',
                'description' => 'Pelayanan diagnosis dan pengobatan penyakit sistem saraf.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Kulit',
                'description' => 'Pelayanan kesehatan kulit, rambut, dan kuku.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Gigi',
                'description' => 'Pelayanan kesehatan gigi dan mulut.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'name'        => 'Poli Mata',
                'description' => 'Pelayanan diagnosis dan pengobatan penyakit mata.',
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ];

        DB::table('departments')->insert($departments);

        $this->command->info('✅ DepartmentSeeder: ' . count($departments) . ' department berhasil dibuat.');
    }
}
