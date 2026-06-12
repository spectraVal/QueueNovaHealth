# ADR-003: Laravel REST API Backend

## Status

Accepted

## Date

2026-06-05

## Context

QueueNova Health membutuhkan backend yang dapat mendukung pengembangan fitur sistem antrean dan appointment booking dengan cepat serta mudah dipelihara oleh tim kecil.

Kebutuhan backend meliputi:

- Penyediaan REST API untuk frontend
- Struktur aplikasi yang produktif dan mudah dikembangkan
- Dukungan fitur bawaan yang mengurangi kebutuhan implementasi manual
- Kemampuan menjalankan proses asynchronous menggunakan queue
- Pemisahan frontend dan backend secara jelas meskipun berada dalam satu repository

Alternatif yang dipertimbangkan adalah NestJS.

## Decision

Kami menggunakan **Laravel** sebagai framework backend dan mengimplementasikan komunikasi melalui **REST API**.

Frontend dan backend dipisahkan secara arsitektural (decoupled architecture), namun tetap berada dalam satu monorepo untuk memudahkan koordinasi pengembangan.

Fitur queue Laravel akan digunakan untuk mendukung kebutuhan proses asynchronous apabila diperlukan pada pengembangan berikutnya.

## Consequences

### Positif

- Tim telah menguasai Laravel sehingga pengembangan lebih efisien
- Banyak fitur bawaan tersedia tanpa memerlukan library tambahan
- Struktur proyek dan praktik pengembangan Laravel sudah matang
- Queue system tersedia dan siap digunakan untuk kebutuhan background processing
- REST API mudah diintegrasikan dengan frontend React

### Negatif

- Konsumsi resource dapat lebih tinggi dibanding framework yang lebih minimalis
- Ketergantungan terhadap ekosistem Laravel cukup besar
- Pemisahan frontend dan backend memerlukan pengelolaan kontrak API yang disiplin
- Skalabilitas horizontal memerlukan perencanaan tambahan ketika sistem berkembang
