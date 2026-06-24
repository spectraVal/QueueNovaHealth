# ADR-004: PostgreSQL Database

## Status

Accepted

## Date

2026-06-05

## Context

QueueNova Health membutuhkan database yang mampu menyimpan data relasional untuk sistem antrean dan appointment booking secara konsisten dan andal.

Kebutuhan utama meliputi:

- Penyimpanan data relasional yang terstruktur
- Dukungan transaksi yang konsisten
- Kemampuan mendukung kebutuhan reporting
- Solusi open source yang dapat digunakan tanpa biaya lisensi
- Kemudahan integrasi dengan Laravel

Alternatif yang dipertimbangkan adalah MySQL.

## Decision

Kami menggunakan **PostgreSQL** sebagai database utama aplikasi.

PostgreSQL dipilih karena bersifat open source, memiliki kepatuhan ACID yang kuat, serta mampu mendukung kebutuhan data relasional dan reporting yang menjadi fokus aplikasi.

Pada tahap awal, sistem menggunakan satu instance database.

## Consequences

### Positif

- Open source dan bebas biaya lisensi
- Menyediakan implementasi ACID yang kuat untuk menjaga konsistensi data
- Cocok untuk data relasional yang menjadi kebutuhan utama aplikasi
- Mendukung kebutuhan reporting dengan baik
- Integrasi dengan Laravel sudah matang dan stabil

### Negatif

- Membutuhkan pemahaman administrasi database yang lebih baik dibanding solusi yang lebih sederhana
- Scaling database memerlukan perencanaan tambahan ketika beban meningkat
- Operasional backup dan recovery tetap perlu dikelola secara disiplin
- Satu instance database menjadi single point of failure apabila tidak disertai strategi redundansi
