# PaperTrail — Multi-Platform Production Ecosystem

> **Never lose an important document again.**

PaperTrail is an enterprise-grade personal document management ecosystem architected as an independently maintainable multi-platform monorepo:

1. **PaperTrail Web & Mobile (`apps/web`)**: A dedicated **React 19 + TypeScript + Vite** web application packaged for Android via **Capacitor 8**, featuring responsive layouts, real-time search, and native device capabilities (Camera, Share Sheet, Local Notifications, Biometrics, Status Bar).
2. **PaperTrail Backend (`apps/api`)**: A centralized **NestJS 11 REST API** operating under `/api/v1` with Swagger/OpenAPI documentation, Clerk session verification, Cloudflare R2 presigned storage pipelines, and Neon PostgreSQL via Prisma ORM.
3. **PaperTrail Worker (`apps/worker`)**: An asynchronous background processing worker powered by Inngest for Gemini OCR metadata extraction and nightly expiration reminder alerts.

---

## Architecture at a Glance

```
papertrail/
├── apps/
│   ├── web/                  # React 19 SPA & Capacitor Android (Vite, Tailwind CSS, Native Bridge)
│   ├── api/                  # Centralized NestJS REST API (/api/v1, Swagger, Clerk)
│   └── worker/               # Background Worker (Inngest, Gemini OCR, Resend)
│
├── packages/
│   ├── api-client/           # Shared isomorphic typed API client
│   ├── contracts/            # REST endpoint contracts & DTOs
│   ├── types/                # Domain models (User, Document, Reminder, etc.)
│   ├── validators/           # Zod validation schemas
│   ├── design-tokens/        # Cobalt blue palette, radii, typography & shadows
│   └── config/               # Shared TypeScript and lint configs
│
├── prisma/
│   └── schema.prisma         # Neon PostgreSQL database schema
│
├── docs/
│   ├── architecture.md       # Detailed system design & cross-platform sync
│   ├── api-reference.md      # Full REST API endpoints specification
│   ├── database-schema.md    # Prisma ERD & relational table schemas
│   └── deployment.md         # Production deployment
│
├── .github/
│   └── workflows/            # GitHub Actions CI
│
├── pnpm-workspace.yaml       # pnpm workspace definition
├── turbo.json                # Turborepo task pipeline
└── package.json              # Monorepo root scripts
```

---

## Technology Stack

| Platform / Layer | Technologies & Tools |
| :--- | :--- |
| **Web & Mobile App** | React 19, TypeScript, Vite 6, Tailwind CSS 3.4, Framer Motion 12, Capacitor 8 (Android) |
| **Backend API** | NestJS 11, TypeScript, REST API (`/api/v1`), Swagger / OpenAPI, Throttler rate limiting |
| **Database & ORM** | Neon Serverless PostgreSQL, Prisma ORM 6 |
| **Object Storage** | Cloudflare R2 (Private bucket with short-lived presigned upload/download URLs) |
| **Authentication** | Clerk (Shared across Web & Mobile with backend token verification) |
| **AI & OCR** | Google Gemini API 2.5 Flash (`@google/genai`) / Google Cloud Vision |
| **Background Processing**| Inngest job queue, Resend for email alerts, Expo Push Notifications |
| **Monorepo Engine** | pnpm workspaces (v12.16.1), Turborepo |

---

## Core Principles & Engineering Standards

- **Pure Client Architecture**: The web and mobile experience is a pure React SPA bundled with Vite for optimal speed, packaged natively for Android via Capacitor 8.
- **Native Android Capabilities**: Uses Capacitor plugins for native Android camera framing, biometrics, share sheets, local notifications, and system status bar controls.
- **Single Source of Truth**: The client consumes the backend endpoints, database schema, and storage buckets through the shared `@papertrail/api-client` package.
- **Direct Presigned Storage**: Sensitive document files are uploaded directly from client applications to private Cloudflare R2 storage using short-lived signed URLs, preventing server bottlenecks and credential leakage.
- **Zero-Config Local Fallback**: Full offline fallback datasets so developers can test the complete UI without needing live cloud credentials immediately.

---

## Quick Start & Local Development

### Prerequisites
- **Node.js**: `v20.x` or `v24.x`
- **pnpm**: `v12.x` or higher (`npm install -g pnpm`)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy the template configuration files:
```bash
cp .env.example .env.local
```

### 3. Run Applications Independently

```bash
# Start the React Web Application (http://localhost:5173)
pnpm dev:web

# Start the NestJS Backend API (http://localhost:8000/api/v1)
pnpm dev:api

# Launch Android in Android Studio
pnpm dev:android

# Start the Inngest Background Worker
pnpm dev:worker
```

### 4. Build All Applications & Packages
```bash
pnpm build
```

---

## Android Mobile Application (Capacitor)

PaperTrail packages natively for Android using Capacitor:

```bash
cd apps/web

# Sync web assets and plugins to native Android
npx cap sync android

# Open Android Studio
npx cap open android
```

---

## Detailed Documentation

- [System Architecture & Data Flow](docs/architecture.md)
- [REST API Reference & Endpoints](docs/api-reference.md)
- [Database Schema & Prisma ERD](docs/database-schema.md)
- [Production Deployment & EAS Guide](docs/deployment.md)

---

*PaperTrail — Engineered for security, speed, and cross-platform document peace of mind.*
