# ADR-001: Monorepo Structure

## Status

Accepted

## Date

2026-06-05

## Context

QueueNova Health dikerjakan oleh tim 2 developer dengan pembagian frontend dan backend.
Kami membutuhkan strategi manajemen repository yang memungkinkan:

- Koordinasi perubahan lintas frontend dan backend dalam satu PR jika diperlukan
- Satu pipeline CI yang dapat memverifikasi keseluruhan sistem
- Kemudahan onboarding karena semua kode ada di satu tempat
- Konsistensi dokumentasi, Docker, dan konfigurasi GitHub Actions

Alternatif yang dipertimbangkan adalah polyrepo (dua repository terpisah untuk frontend dan backend).

## Decision

Kami menggunakan **monorepo** dengan struktur:
project/
├── .github/
├── backend/
├── infrastructure/
├── docs/
├── frontend/
├── README.md
└── docker-compose.yml
Setiap bagian memiliki scope yang jelas dan tidak saling mengintervensi,
namun tetap dalam satu repository untuk kemudahan koordinasi.

## Consequences

### Positif

- Satu repository untuk di-clone, satu CI pipeline untuk dikelola
- Perubahan yang membutuhkan update frontend dan backend bisa masuk dalam satu PR
- Dokumentasi dan keputusan arsitektur terpusat di `docs/`
- Docker Compose root dapat mengorkestrasikan semua service sekaligus

### Negatif

- CI pipeline harus didesain dengan hati-hati agar job frontend dan backend tidak saling memblokir secara tidak perlu
- Akses kontrol per-folder tidak bisa dilakukan di level repository (hanya lewat konvensi tim)
- Ukuran repository akan lebih besar seiring waktu karena semua artifact ada di satu tempat
