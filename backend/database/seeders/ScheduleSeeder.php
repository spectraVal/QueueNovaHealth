<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $now   = Carbon::now();
        $today = Carbon::today();

        /**
         * Sesuai ERD Create Doctor Schedule:
         * - INSERT INTO schedule_templates
         * - Validasi: satu dokter tidak boleh punya 2 template aktif di hari yang sama
         * - valid_until > valid_from
         * - Setelah INSERT, auto-generate ScheduleInstances untuk 2 minggu ke depan
         *
         * doctor_id mengikuti urutan DoctorSeeder (1-9):
         *  1=dr.Budi(Umum), 2=dr.Sari(Umum), 3=dr.Andi(Jantung),
         *  4=dr.Maya(Anak), 5=dr.Nina(Kandungan), 6=dr.Rizal(Saraf),
         *  7=dr.Lina(Kulit), 8=drg.Hendra(Gigi), 9=dr.Rini(Mata)
         */
        $templates = [
            // ── dr. Budi Santoso (Poli Umum) ──────────────────────────────────
            ['doctor_id' => 1, 'day_of_week' => 'senin',   'start_time' => '08:00', 'end_time' => '12:00', 'max_patients' => 20],
            ['doctor_id' => 1, 'day_of_week' => 'rabu',    'start_time' => '08:00', 'end_time' => '12:00', 'max_patients' => 20],
            ['doctor_id' => 1, 'day_of_week' => 'jumat',   'start_time' => '08:00', 'end_time' => '11:00', 'max_patients' => 15],

            // ── dr. Sari Dewi (Poli Umum) ─────────────────────────────────────
            ['doctor_id' => 2, 'day_of_week' => 'selasa',  'start_time' => '13:00', 'end_time' => '17:00', 'max_patients' => 20],
            ['doctor_id' => 2, 'day_of_week' => 'kamis',   'start_time' => '13:00', 'end_time' => '17:00', 'max_patients' => 20],

            // ── dr. Andi Wijaya (Poli Jantung) ────────────────────────────────
            ['doctor_id' => 3, 'day_of_week' => 'senin',   'start_time' => '09:00', 'end_time' => '13:00', 'max_patients' => 12],
            ['doctor_id' => 3, 'day_of_week' => 'kamis',   'start_time' => '09:00', 'end_time' => '13:00', 'max_patients' => 12],

            // ── dr. Maya Putri (Poli Anak) ────────────────────────────────────
            ['doctor_id' => 4, 'day_of_week' => 'selasa',  'start_time' => '08:00', 'end_time' => '12:00', 'max_patients' => 15],
            ['doctor_id' => 4, 'day_of_week' => 'sabtu',   'start_time' => '08:00', 'end_time' => '12:00', 'max_patients' => 15],

            // ── dr. Nina Rahayu (Poli Kandungan) ─────────────────────────────
            ['doctor_id' => 5, 'day_of_week' => 'rabu',    'start_time' => '10:00', 'end_time' => '14:00', 'max_patients' => 10],
            ['doctor_id' => 5, 'day_of_week' => 'jumat',   'start_time' => '13:00', 'end_time' => '17:00', 'max_patients' => 10],

            // ── dr. Rizal Firmansyah (Poli Saraf) ────────────────────────────
            ['doctor_id' => 6, 'day_of_week' => 'senin',   'start_time' => '14:00', 'end_time' => '17:00', 'max_patients' => 10],
            ['doctor_id' => 6, 'day_of_week' => 'rabu',    'start_time' => '14:00', 'end_time' => '17:00', 'max_patients' => 10],

            // ── dr. Lina Kusuma (Poli Kulit) ──────────────────────────────────
            ['doctor_id' => 7, 'day_of_week' => 'selasa',  'start_time' => '09:00', 'end_time' => '13:00', 'max_patients' => 15],
            ['doctor_id' => 7, 'day_of_week' => 'sabtu',   'start_time' => '09:00', 'end_time' => '12:00', 'max_patients' => 10],

            // ── drg. Hendra Pratama (Poli Gigi) ──────────────────────────────
            ['doctor_id' => 8, 'day_of_week' => 'senin',   'start_time' => '08:00', 'end_time' => '11:00', 'max_patients' => 10],
            ['doctor_id' => 8, 'day_of_week' => 'kamis',   'start_time' => '13:00', 'end_time' => '16:00', 'max_patients' => 10],

            // ── dr. Rini Oktavia (Poli Mata) ──────────────────────────────────
            ['doctor_id' => 9, 'day_of_week' => 'rabu',    'start_time' => '09:00', 'end_time' => '13:00', 'max_patients' => 12],
            ['doctor_id' => 9, 'day_of_week' => 'jumat',   'start_time' => '09:00', 'end_time' => '12:00', 'max_patients' => 12],
        ];

        $validFrom  = $today->toDateString();
        $validUntil = $today->copy()->addMonths(6)->toDateString();

        $insertedTemplateIds = [];

        foreach ($templates as $tmpl) {
            $templateId = DB::table('schedule_templates')->insertGetId([
                'doctor_id'    => $tmpl['doctor_id'],
                'day_of_week'  => $tmpl['day_of_week'],
                'start_time'   => $tmpl['start_time'],
                'end_time'     => $tmpl['end_time'],
                'max_patients' => $tmpl['max_patients'],
                'is_active'    => true,
                'valid_from'   => $validFrom,
                'valid_until'  => $validUntil,
                'created_at'   => $now,
                'updated_at'   => $now,
            ]);

            $insertedTemplateIds[] = [
                'template_id'  => $templateId,
                'doctor_id'    => $tmpl['doctor_id'],
                'day_of_week'  => $tmpl['day_of_week'],
                'start_time'   => $tmpl['start_time'],
                'end_time'     => $tmpl['end_time'],
                'max_patients' => $tmpl['max_patients'],
            ];
        }

        $this->command->info('✅ ScheduleSeeder: ' . count($templates) . ' template berhasil dibuat.');

        // ── Auto-generate ScheduleInstances untuk 14 hari ke depan ────────────
        // Sesuai ERD: Setelah INSERT, auto-generate instances untuk 2 minggu ke depan
        $this->generateInstances($insertedTemplateIds, $today, $now);
    }

    /**
     * generateInstances
     * Sesuai ERD Create Doctor Schedule:
     * Laravel Scheduler auto-generate ScheduleInstances untuk 2 minggu ke depan.
     * Cari semua template is_active=true → generate instance per tanggal
     * sesuai day_of_week dalam 14 hari.
     */
    private function generateInstances(array $templates, Carbon $today, Carbon $now): void
    {
        $dayMap = [
            'senin'   => Carbon::MONDAY,
            'selasa'  => Carbon::TUESDAY,
            'rabu'    => Carbon::WEDNESDAY,
            'kamis'   => Carbon::THURSDAY,
            'jumat'   => Carbon::FRIDAY,
            'sabtu'   => Carbon::SATURDAY,
            'minggu'  => Carbon::SUNDAY,
        ];

        $instances = [];

        foreach ($templates as $tmpl) {
            $targetDayOfWeek = $dayMap[$tmpl['day_of_week']] ?? null;
            if ($targetDayOfWeek === null) {
                continue;
            }

            // Loop 14 hari ke depan
            for ($i = 0; $i < 14; $i++) {
                $date = $today->copy()->addDays($i);

                if ($date->dayOfWeek !== $targetDayOfWeek) {
                    continue;
                }

                $instances[] = [
                    'template_id'   => $tmpl['template_id'],
                    'doctor_id'     => $tmpl['doctor_id'],
                    'date'          => $date->toDateString(),
                    'start_time'    => $tmpl['start_time'],
                    'end_time'      => $tmpl['end_time'],
                    'max_patients'  => $tmpl['max_patients'],
                    'status'        => 'active',
                    'is_override'   => false,
                    'override_note' => null,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ];
            }
        }

        if (! empty($instances)) {
            // Insert dalam batch
            foreach (array_chunk($instances, 50) as $chunk) {
                DB::table('schedule_instances')->insert($chunk);
            }
        }

        $this->command->info('✅ ScheduleSeeder: ' . count($instances) . ' instance jadwal (14 hari) berhasil di-generate.');
    }
}
