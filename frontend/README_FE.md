# QueueNova Health — Frontend

React + Vite + TypeScript frontend for the QueueNova Health hospital queue
management system.

## Tech Stack

- **Framework** — React 18 + Vite
- **Language** — TypeScript (strict)
- **HTTP Client** — Axios
- **Auth** — Laravel Sanctum cookie-based SPA
- **Testing** — Vitest + React Testing Library
- **Node.js** — v22

## Folder Structure
src/

├── api/          # Axios instance and base HTTP config

├── components/   # Reusable UI components (Rule of Three applies)

├── contexts/     # React Context (AuthContext)

├── hooks/        # Custom hooks (useAuth)

├── pages/        # Page-level components, one per route

├── routes/       # PublicRoute and ProtectedRoute guards

├── services/     # API call abstractions (authService)

├── types/        # Shared TypeScript interfaces

└── tests/        # Unit tests mirroring src structure

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL (with `/api`) | `http://localhost:8000/api` |
| `VITE_API_BASE_URL` | Backend base URL (without `/api`) | `http://localhost:8000` |

> `VITE_API_BASE_URL` is required for `GET /sanctum/csrf-cookie` which lives
> outside the `/api` prefix.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run tests once (CI mode) |
| `npm run test:watch` | Run tests in watch mode |

## Architecture

### Auth Flow
App mount → GET /auth/me → session valid? → rehydrate user state

↓ 401

user = null → redirect to /login
Login → GET /sanctum/csrf-cookie → POST /auth/login → setAuth → redirect

Logout → POST /auth/logout → clearAuth → redirect to /login

### Key Rules

1. Components never call Axios directly — always through service layer
2. No business logic in components — UI only, call hooks/services
3. All API calls go through `src/api/axiosInstance.ts`
4. `withCredentials: true` on all requests (Sanctum requirement)
5. Reusability follows Rule of Three

### Route Guards

- **PublicRoute** — redirects authenticated users to `/dashboard`
- **ProtectedRoute** — redirects unauthenticated users to `/login`
- Both guards wait for `isLoading` (session rehydration) before redirecting

## Testing

```bash
npm run test
```

Tests are located in `src/tests/` mirroring the `src/` structure.

| File | Tests |
|------|-------|
| `tests/pages/RegisterPage.test.tsx` | 6 tests |
| `tests/pages/LoginPage.test.tsx` | 7 tests |
| `tests/components/LogoutButton.test.tsx` | 4 tests |

### What is tested

- Render correctness
- User interaction (form submit, button click)
- Service call assertions (correct payload)
- Error handling (422 per-field, 401, 500)
- Loading state behavior

### What is NOT tested

- Axios internals
- Implementation details
- Cookie behavior (integration concern, not unit test)

## Sprint 9 — Authentication

| Task | Status |
|------|--------|
| AUTH-01 Register Page | ✅ Done |
| AUTH-02 Login Page | ✅ Done |
| AUTH-03 Logout + Session Rehydration | ✅ Done |
| AUTH-04 Patient Profile Page | 🔲 In Progress |