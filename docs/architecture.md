# PaperTrail — Multi-Platform System Architecture

This document describes the high-level system architecture, cross-platform synchronization model, and service boundaries of **PaperTrail – Personal Digital Document Vault**.

---

## 1. Architectural Overview

PaperTrail is organized as a unified monorepo containing three independently deployable applications and six shared packages:

```
┌─────────────────────────────────────────────────────────────┐
│                 PaperTrail Web & Android App                │
│     (React 19 + TypeScript + Vite + Capacitor 8 Android)    │
│    Responsive Desktop / Tablet / Mobile Full-Bleed Layout    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │   HTTP / REST (JWT Bearer Auth)
                               ▼
               ┌───────────────────────────────┐
               │      PaperTrail Backend       │
               │  (NestJS 11 REST API /api/v1) │
               │  Swagger OpenAPI, Rate Limit  │
               └───────┬───────────────┬───────┘
                       │               │
      ┌────────────────┴──────┐        └────────────────┐
      ▼                       ▼                         ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────────┐
│    Neon PostgreSQL    │ │   Cloudflare R2   │ │     Inngest Worker        │
│      Prisma ORM       │ │  Private Storage  │ │   Background Jobs & Cron  │
│  Users, Docs, Alerts  │ │  Presigned URLs   │ │   Gemini OCR & Resend     │
└───────────────────────┘ └───────────────────┘ └───────────────────────────┘
```

---

## 2. Core Service Boundaries

### A. PaperTrail Web & Mobile (`apps/web`)
- **Technology**: React 19, TypeScript, Vite 6, Tailwind CSS 3.4, Framer Motion 12, Lucide React, Capacitor 8.
- **Responsibility**: Responsive browser experience on desktop/tablet and native Android APK/AAB package.
- **Hardware Integrations (Capacitor Native Bridge)**:
  - Camera scanning with `@capacitor/camera` (viewfinder, flash controls, and gallery picker).
  - Native file sharing via `@capacitor/share`.
  - Push and local notifications via `@capacitor/local-notifications` and `@capacitor/push-notifications`.
  - Android Status Bar styling and Splash Screen lifecycle controls.
  - Hardware back button listener for fluid navigation.
- **Data Integration**: Consumes `@papertrail/api-client` with local offline state fallback.

### B. Centralized Backend (`apps/api`)
- **Technology**: NestJS 11, TypeScript, Swagger/OpenAPI, Prisma ORM, `@clerk/backend`, `@aws-sdk/client-s3`.
- **Responsibility**: Single source of truth for business logic, document metadata, authorization, storage presigning, and expiration mathematics.
- **Security**: Strict document ownership guards, rate limiting, and input validation via `@papertrail/validators`.

### D. Background Worker (`apps/worker`)
- **Technology**: Inngest job processor, Google Gemini API (`@google/genai`), Resend email delivery.
- **Functions**:
  1. `document/uploaded`: Triggered upon file upload to run OCR text extraction and suggest categories.
  2. `scan-expiring-documents`: Daily cron scanning for documents expiring in 15, 30, and 45 days, dispatching email and push notifications.

---

## 3. Storage Architecture: Cloudflare R2 Direct Uploads

To ensure maximum performance and security, files **never pass directly through the backend server**. Instead, PaperTrail uses presigned URLs:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Web / Mobile)
    participant API as NestJS Backend
    participant R2 as Cloudflare R2
    participant DB as Neon PostgreSQL
    participant Worker as Background Worker

    User->>API: POST /api/v1/storage/upload-url (filename, mime, size)
    API->>API: Validate quota, file type & user session
    API->>R2: Generate S3 PutObject presigned URL (15m expiry)
    API-->>User: Return { uploadUrl, fileKey }
    User->>R2: Direct PUT file binary to presigned URL
    User->>API: POST /api/v1/documents (metadata + fileKey)
    API->>DB: Save document record & update user storage bytes
    API->>Worker: Trigger event 'document/uploaded'
    Worker->>R2: Read file bytes
    Worker->>Worker: Gemini OCR & metadata extraction
    Worker->>DB: Update document with ocrText & auto-tags
    API-->>User: Return 201 Created (DocumentItem)
```

---

## 4. Cross-Platform Synchronization

Both Web and Mobile clients interact with the identical REST API under `/api/v1`:
- **Server Authoritative**: All mutations (create, rename, delete, renew) take effect on Neon PostgreSQL immediately.
- **Offline Cache Invalidation**: The client caches document metadata locally using persistent browser/Capacitor storage. When the device reconnects, the cache is refreshed against the server's `updatedAt` timestamps.
- **Simultaneous Access**: Actions performed on an Android phone (e.g. scanning an insurance card) are instantly visible on the Web application upon refreshing or query invalidation.

---

## 5. Security & Isolation Model

1. **Zero Storage Credential Leakage**: R2 Access Keys and Secret Keys exist solely in the backend runtime environment. Frontend applications receive short-lived, pre-signed URLs scoped to their specific file keys.
2. **Document Ownership Enforced at Database Level**: Every SQL query is parameterized with the authenticated user's `userId` derived from the verified Clerk JWT.
3. **MIME Type & Quota Validation**: File size limits (50 MB default) and total vault storage limits (500 MB default) are validated both in the Zod contract schema and in the storage service before issuing upload tickets.
