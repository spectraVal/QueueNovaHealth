<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Urutan seeder WAJIB diikuti karena ada relasi FK antar tabel:
     *
     *  1. DepartmentSeeder  → tabel departments (tidak ada FK ke mana-mana)
     *  2. AdminSeeder       → users + admins
     *  3. DoctorSeeder      → users + doctors (FK ke departments)
     *  4. NurseSeeder       → users + nurses  (FK ke departments, nullable)
     *  5. PatientSeeder     → users + patients
     *  6. ScheduleSeeder    → schedule_templates + schedule_instances (FK ke doctors)
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('🏥 QueueNovaHealth - Master Data Seeder');
        $this->command->info('==========================================');

        $this->call([
            DepartmentSeeder::class,  // harus pertama (FK target untuk doctors & nurses)
            AdminSeeder::class,
            DoctorSeeder::class,      // butuh departments sudah ada
            NurseSeeder::class,       // butuh departments sudah ada
            PatientSeeder::class,
            ScheduleSeeder::class,    // butuh doctors sudah ada
        ]);

        $this->command->info('');
        $this->command->info('==========================================');
        $this->command->info('✅ Semua master data berhasil di-seed!');
        $this->command->info('');
        $this->command->info('Akun default:');
        $this->command->info('  Admin        → admin@novahealth.com         | password: admin123');
        $this->command->info('  Dokter       → dr.budi@novahealth.com       | password: password123');
        $this->command->info('  Perawat      → ns.fitri@novahealth.com      | password: password123');
        $this->command->info('  Pasien       → pasien.budi@gmail.com        | password: password123');
        $this->command->info('');
    }
}
