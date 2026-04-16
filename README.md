# Wesal API

A comprehensive **charitable distribution and beneficiary management system** built with NestJS. Wesal enables institutions to manage the allocation and delivery of aid coupons to beneficiaries, track distributions, and communicate with recipients at scale.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Modules](#modules)
- [Authentication & Security](#authentication--security)
- [Caching Strategy](#caching-strategy)
- [Rate Limiting](#rate-limiting)
- [File Uploads](#file-uploads)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

---

## Features

- **Multi-tenant institutions** — each institution manages its own employees, beneficiaries, distributions, and posts
- **Role-based access control** — four employee roles (Admin, Distributer, Publisher, Deliverer) with fine-grained permissions
- **Distribution lifecycle** — manage campaigns through DRAFT → ACTIVE → COMPLETED → CANCELLED states
- **Coupon allocation & delivery** — allocate coupons per round, track delivery status per beneficiary
- **Beneficiary management** — register and filter beneficiaries by health status, housing status, income range, family size, and more
- **Family member tracking** — link spouses, children, and parents to each beneficiary
- **Messaging system** — create and send targeted notifications, alerts, and reminders to beneficiaries with delivery tracking
- **Institution posts** — publish announcements with image uploads and soft-delete support
- **File uploads** — profile images and post images with categorized disk storage
- **JWT authentication** — separate auth flows for institution employees and beneficiaries with refresh token rotation
- **Redis caching** — intelligent route-based TTL caching with version-based invalidation
- **Rate limiting** — global and per-route throttling to protect endpoints
- **Swagger UI** — interactive API documentation available out of the box

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | NestJS 11 / Express 5 |
| Language | TypeScript 5.8 |
| Database | PostgreSQL |
| ORM | Prisma 7.5 |
| Cache | Redis (cache-manager) |
| Auth | JWT + Passport, bcrypt |
| Validation | class-validator, class-transformer |
| File uploads | Multer |
| API Docs | Swagger / OpenAPI |
| Logging | Winston (nest-winston) |
| Rate limiting | @nestjs/throttler |
| Security | Helmet, CORS, CSRF protection |
| Testing | Jest, Supertest |
| Build | SWC (fast transpiler) |

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                      Client / Frontend                 │
└────────────────────────────┬───────────────────────────┘
                             │ HTTP + Cookies
┌────────────────────────────▼───────────────────────────┐
│                   NestJS API (Wesal)                   │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐ │
│  │ Auth     │  │ Guards    │  │ Interceptors          │ │
│  │ JWT/CSRF │  │ RBAC/Rate │  │ Cache / Logger        │ │
│  └──────────┘  └───────────┘  └──────────────────────┘ │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Modules: Institution · Employee · Beneficiary  │   │
│  │  Distribution · Round · Coupon · Message        │   │
│  │  Post · Family Member · Uploads                 │   │
│  └─────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────┬──────────────────┘
           │                          │
    ┌──────▼──────┐           ┌───────▼──────┐
    │  PostgreSQL │           │    Redis      │
    │  (Prisma)   │           │   (Cache)     │
    └─────────────┘           └──────────────┘
```

---

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** database
- **Redis** server
- **npm** or **yarn**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/wesal.git
cd wesal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the required values in `.env` (see [Environment Variables](#environment-variables)).

### 4. Run database migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

Swagger UI is available at `http://localhost:3000/api/docs`.

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wesal

# JWT Secrets (64-byte hex strings)
JWT_SECRET=your_64_byte_hex_access_secret
JWT_REFRESH_SECRET=your_64_byte_hex_refresh_secret

# App
NODE_ENV=development
PORT=3000
SERVER_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=300
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Access token signing key (64-byte hex) |
| `JWT_REFRESH_SECRET` | Yes | — | Refresh token signing key (64-byte hex) |
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `PORT` | No | `3000` | Server port |
| `SERVER_URL` | No | — | Public server URL |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Allowed frontend origin |
| `REDIS_HOST` | No | `localhost` | Redis server host |
| `REDIS_PORT` | No | `6379` | Redis server port |
| `REDIS_TTL` | No | `300` | Default cache TTL (seconds) |

---

## API Documentation

Once the server is running, visit the Swagger UI at:

```
http://localhost:3000/api/docs
```

The API is organized into the following tag groups:

- `auth-institution` — Institution employee authentication
- `auth-beneficiary` — Beneficiary authentication
- `institutions` — Institution management
- `employees` — Employee management
- `beneficiaries` — Beneficiary management
- `family-members` — Family member management
- `distributions` — Distribution campaigns
- `rounds` — Distribution rounds
- `coupons` — Coupon templates
- `round-allocations` — Coupon allocation and delivery
- `messages` — Message creation and sending
- `message-deliveries` — Delivery tracking
- `posts` — Institution posts and announcements
- `uploads` — File upload endpoints

---

## Modules

### Auth
Handles JWT-based authentication for both institution employees and beneficiaries. Issues access tokens (15-minute expiry) and refresh tokens stored in HTTP-only cookies (7-day expiry). Includes CSRF protection on token refresh endpoints.

### Institution
Institution registration, profile management, search, and statistics. Institutions are the top-level multi-tenant entity.

### Employee
Manage institution staff members. Supports creating, updating, activating/deactivating employees, assigning roles, and changing passwords.

**Employee Roles:**

| Role | Capabilities |
|---|---|
| `ADMIN` | Full access to all institution resources |
| `DISTRIBUTER` | Manage distributions, rounds, coupons, and allocations |
| `PUBLISHER` | Create and manage institution posts |
| `DELIVERER` | Deliver coupons and view allocations |

### Beneficiary
Register and manage beneficiaries. Supports filtering by health status, housing status, income, and family size. Beneficiaries authenticate separately from employees.

### Family Member
Manage family members (spouse, child, parent) linked to each beneficiary with health status tracking.

### Distribution
Create and manage aid distribution campaigns. Linked to a coupon template and progresses through: `DRAFT → ACTIVE → COMPLETED → CANCELLED`.

### Round
Manage distribution rounds within a campaign. Each round tracks its own status and coupon allocation count.

### Coupon
Define reusable coupon templates with types: `CASH`, `FOOD`, `SHOPPING`, `OTHER`.

### Round-Beneficiary (Allocations)
Allocate beneficiaries to a round, generate coupon codes, and track delivery status (`PENDING`, `DELIVERED`, `MISSED`) per beneficiary.

### Message
Create messages for beneficiaries with types: `NOTIFICATION`, `ALERT`, `PROMOTION`, `REMINDER`, `UPDATE`. Send to a specific list of beneficiaries or to all beneficiaries in a round.

### Message Delivery
Track individual delivery status per beneficiary: `PENDING → SENT → DELIVERED → READ`. Mark messages as read, retrieve unread counts, and handle delivery failures.

### Post
Institution announcements with multi-image support and soft-delete. Publicly visible.

### Uploads
Profile image and post image upload with categorized disk storage.

---

## Authentication & Security

### JWT Flow

1. Login returns a short-lived **access token** (15 min) in the response body.
2. A long-lived **refresh token** (7 days) is set as an HTTP-only cookie.
3. Use `POST /auth/institution/refresh` (or `/auth/beneficiary/refresh`) with a valid CSRF token to obtain a new access token.
4. Logout clears the refresh token cookie.

### Security Measures

- **Helmet** — HTTP security headers
- **CORS** — configurable origin, credentials enabled, 24-hour preflight cache
- **CSRF protection** — token validation on refresh endpoints
- **bcrypt** — password hashing
- **HTTP-only cookies** — refresh tokens never exposed to JavaScript
- **Secure cookies** — enabled automatically in production

---

## Caching Strategy

Redis caching is applied via a custom `CachingInterceptor` with route-aware TTLs:

| Route Category | TTL | Reason |
|---|---|---|
| Message deliveries | 0s (no cache) | Real-time data |
| Round allocations | 30s | High-frequency reads |
| Messages, rounds | 1–2 min | Moderate freshness |
| Beneficiaries | 2 min | Moderate freshness |
| Coupons, distributions | 5 min | Relatively static |
| Institutions, posts | 10 min | Mostly static |

Cache keys are scoped per institution or per user. Write operations (POST, PUT, PATCH, DELETE) automatically bump a version counter to invalidate stale cache entries.

---

## Rate Limiting

| Scope | Limit |
|---|---|
| Global | 100 requests / 60 seconds |
| Auth endpoints | 5 requests / 15 minutes |

Exceeding the limit returns a `429 Too Many Requests` response with a message indicating how long to wait.

---

## File Uploads

Uploaded files are stored on disk under categorized directories:

- Profile images: `uploads/profile/`
- Post images: `uploads/posts/`

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/uploads/profile` | Upload profile image |
| `GET` | `/uploads/profile` | Get authenticated user's profile image |
| `GET` | `/uploads/profile/:id` | Get beneficiary's profile image |
| `DELETE` | `/uploads/profile-image` | Delete authenticated user's profile image |
| `POST` | `/uploads/post/:id` | Upload post images (multiple) |
| `GET` | `/uploads/post/:id` | Get post images |
| `DELETE` | `/uploads/post/:postId/image/:imageName` | Delete specific post image |

---

## Scripts

```bash
# Development
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start with debug + hot-reload

# Production
npm run build            # Generate Prisma client + compile TypeScript
npm run start:prod       # Run compiled output

# Code quality
npm run lint             # Lint and auto-fix
npm run format           # Format with Prettier

# Testing
npm run test             # Unit tests
npm run test:watch       # Unit tests in watch mode
npm run test:cov         # Unit tests with coverage report
npm run test:e2e         # End-to-end tests
```

---

## Project Structure

```
wesal/
├── src/
│   ├── main.ts                    # Entry point, Swagger & global middleware setup
│   ├── app.module.ts              # Root module
│   ├── auth/                      # Authentication (JWT, refresh, CSRF)
│   ├── institution/               # Institution management
│   ├── employee/                  # Employee management & RBAC
│   ├── beneficiary/               # Beneficiary management
│   ├── family-member/             # Beneficiary family members
│   ├── distribution/              # Distribution campaigns
│   ├── round/                     # Distribution rounds
│   ├── coupon/                    # Coupon templates
│   ├── round-beneficiary/         # Coupon allocation & delivery
│   ├── message/                   # Messages to beneficiaries
│   ├── message-delivery/          # Message delivery tracking
│   ├── post/                      # Institution posts
│   ├── uploads/                   # File upload handling
│   ├── prisma/                    # Prisma database service
│   └── common/
│       ├── config/                # Environment validation
│       ├── decorators/            # Custom parameter decorators
│       ├── enums/                 # Shared enums
│       ├── filters/               # Global exception filter
│       ├── guards/                # RBAC, CSRF, rate limiting guards
│       ├── interceptors/          # Caching & logger interceptors
│       └── logger/                # Winston logger configuration
├── prisma/
│   └── schema.prisma              # Database schema
├── test/                          # E2E tests
├── .env.example                   # Environment variable template
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## License

This project is licensed under the [MIT License](LICENSE).
