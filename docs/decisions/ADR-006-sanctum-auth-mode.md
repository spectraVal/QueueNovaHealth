# ADR-006: Sanctum Authentication Mode — Cookie-based Session (SPA)

## Status
Accepted

## Date
2025-06-22

## Context
API contract awal (OpenAPI v2.1) mendefinisikan autentikasi menggunakan
Sanctum Bearer Token (plain-text token dikembalikan di response body,
disimpan di frontend, dan dilampirkan manual via header
`Authorization: Bearer {token}`).

Selama implementasi Sprint 9 (AUTH-01, AUTH-02), tim melakukan diskusi
teknis dan menyepakati perubahan ke Sanctum Cookie-based Session (SPA mode).

Dua mode Sanctum yang dipertimbangkan:

**Mode A — Bearer Token**
- Token dikembalikan di response body (`data.token`)
- Frontend menyimpan token (React state, sessionStorage, atau localStorage)
- Setiap request melampirkan `Authorization: Bearer {token}` secara manual
- Stateless dari sisi server per-request

**Mode B — Cookie-based Session (SPA)**
- Tidak ada token di response body
- Frontend melakukan `GET /sanctum/csrf-cookie` sebelum login untuk
  mendapatkan XSRF-TOKEN dan laravel_session cookie
- Laravel mengelola session server-side
- Browser mengirim cookie otomatis di setiap request (`withCredentials: true`)
- CSRF protection dihandle oleh Sanctum via XSRF-TOKEN cookie

## Decision
Tim memilih **Mode B: Cookie-based Session (SPA)**.

Alasan:
1. Tidak ada token yang perlu disimpan di frontend — menghilangkan seluruh
   perdebatan localStorage vs sessionStorage vs React memory
2. CSRF protection built-in dari Sanctum tanpa implementasi tambahan di FE
3. Lebih sesuai dengan use case SPA + same-origin atau subdomain deployment
4. Backend Laravel lebih natural menggunakan session daripada token management
   untuk aplikasi web (bukan mobile/third-party API)

## Consequences

### Positif
- Frontend tidak menyimpan credential dalam bentuk apapun
- Tidak perlu token refresh strategy
- Logout cukup invalidate session di server — tidak perlu tracking token

### Negatif / Trade-off
- Requires `GET /sanctum/csrf-cookie` sebelum setiap login (satu extra request)
- `withCredentials: true` wajib di semua request — sudah terpenuhi di
  `axiosInstance`
- CORS di BE harus dikonfigurasi dengan benar (`supports_credentials: true`,
  `allowed_origins` tidak boleh wildcard `*`)
- Tidak cocok untuk mobile app atau third-party API consumer di masa depan
  tanpa perubahan arsitektur auth

### Dampak ke implementasi yang sudah ada
- `axiosInstance.ts`: interceptor yang attach `Authorization: Bearer` header
  harus dihapus
- `AuthContext.tsx`: tidak perlu menyimpan token, cukup menyimpan `user` object
- `authService.ts`: login harus diawali `GET /sanctum/csrf-cookie`, response
  tidak mengandung token
- `types/auth.ts`: `LoginResponseData` tidak perlu field `token` dan
  `token_type`
- OpenAPI contract perlu diupdate oleh BE untuk mencerminkan perubahan ini
  (in progress)

## Implementation Note
Revisi implementasi FE (axiosInstance, AuthContext, authService, types) akan
dilakukan setelah OpenAPI contract diupdate oleh BE sebagai source of truth.
Kode yang sudah ada (AUTH-01, AUTH-02) masih menggunakan Bearer Token dan
belum mencerminkan keputusan ini.

## References
- Laravel Sanctum SPA Authentication:
  https://laravel.com/docs/sanctum#spa-authentication
- OpenAPI contract v2.1 (Bearer Token — akan diupdate ke v2.2)
- Sprint 9 AUTH-01, AUTH-02 implementation (feature branches)