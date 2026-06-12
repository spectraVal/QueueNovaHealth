# ADR-002: React + Vite Frontend

## Status

Accepted

## Date

2026-06-05

## Context

QueueNova Health membutuhkan frontend yang mampu mendukung pengembangan antarmuka pengguna secara cepat dan maintainable oleh tim yang terdiri dari 2 developer.

Kebutuhan frontend meliputi:

- Pengembangan SPA (Single Page Application) dengan pengalaman pengguna yang responsif
- Dukungan ekosistem library yang luas untuk kebutuhan UI, routing, state management, dan integrasi API
- Startup development server yang cepat untuk meningkatkan produktivitas pengembangan
- Konfigurasi yang sederhana dan mudah dipahami oleh seluruh anggota tim
- Dukungan TypeScript untuk meningkatkan maintainability dan type safety

Alternatif yang dipertimbangkan adalah Vue + Vite.

## Decision

Kami menggunakan **React** sebagai framework frontend dan **Vite** sebagai build tool dengan **TypeScript** sebagai bahasa utama pengembangan.

Arsitektur frontend akan berupa Single Page Application (SPA) yang berkomunikasi dengan backend melalui REST API.

## Consequences

### Positif

- Tim telah familiar dengan React sehingga onboarding dan pengembangan lebih cepat
- Ekosistem React menyediakan banyak library pendukung yang matang
- Vite memberikan startup development server yang cepat dan build yang efisien
- TypeScript membantu mengurangi kesalahan pada tahap development
- Struktur SPA sederhana dan mudah diintegrasikan dengan backend Laravel API

### Negatif

- SEO tidak sebaik pendekatan SSR karena aplikasi menggunakan SPA
- Pengelolaan state dapat menjadi kompleks seiring bertambahnya fitur
- Bundle frontend berpotensi bertambah besar jika dependensi tidak dikelola dengan baik
- React memberikan fleksibilitas tinggi sehingga diperlukan konvensi tim yang konsisten
