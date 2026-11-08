# PaperTrail — Architecture & Project Structure Guide

**Architecture Version:** 2026.1  
**Stack:** TypeScript Monorepo (pnpm + Turbo) · React 19 + Tailwind CSS + Framer Motion · NestJS 11 · Prisma 6 + Neon PostgreSQL · Cloudflare R2 · Capacitor 6 (Android)  

---

## 1. Monorepo Package Topology

```
PaperTraiL/
├── apps/
│   ├── api/                 # NestJS 11 Core Backend API (Port 8000)
│   ├── web/                 # React 19 + Vite Frontend (Desktop Bento & Mobile Responsive)
│   └── worker/              # Background Task Processor & OCR Worker
│
├── packages/
│   ├── types/               # Core domain TypeScript interfaces & models
│   ├── contracts/           # API request/response DTOs & endpoints contract
│   ├── validators/          # Zod schemas for runtime validation
│   ├── api-client/          # Shared strongly-typed Fetch API client
│   ├── design-tokens/       # Design system tokens (colors, typography, radii, shadows)
│   └── config/              # Shared ESLint, Prettier, and TypeScript configurations
│
├── prisma/
│   └── schema.prisma        # PostgreSQL Schema (7 Models: User, Document, Folder, Reminder, Notification, ShareToken, AuditLog)
│
├── tests/
│   ├── onboarding.test.mjs           # 18-step onboarding & security compliance suite
│   ├── workflow-lifecycle.test.mjs  # 8-step application lifecycle validation suite
│   └── verify-neon-connection.mjs   # Direct Neon PostgreSQL connectivity test
│
└── docs/
    ├── security/SECURITY_AUDIT.md    # Vulnerability remediation matrix & audit report
    ├── architecture/PROJECT_STRUCTURE.md  # Architectural layout & design specification
    └── development/CODEBASE_CLEANUP.md    # Refactoring log & bundle optimization report
```

---

## 2. Frontend Architecture (`apps/web`)

The frontend is built using React 19, Tailwind CSS, Framer Motion, and Lucide React icons.

### Directory Structure:
```
apps/web/src/
├── App.tsx                  # Core application shell with dynamic React.lazy code-splitting
├── index.css                # Global styles, Tailwind base, and system design variables
├── auth/
│   ├── AuthLayout.tsx       # Dual-pane auth layout (dark navy hero showcase + clean card form)
│   ├── ClerkAuthProvider.tsx # Multi-provider supporting Clerk Auth + local offline fallback
│   └── useAuth.ts           # Unified authentication hook
├── components/
│   ├── bento/               # Framed desktop bento canvas & mobile responsive layout
│   │   ├── BentoLayout.tsx   # Adaptive grid container
│   │   ├── BentoDock.tsx     # Modern bottom dock with active indicator pill
│   │   └── BentoRightRail.tsx # Storage stats, upcoming reminders, and activity feed
│   ├── ui/                  # PaperTrail Design System components
│   │   ├── Avatar.tsx        # Profile image with fallback initials
│   │   ├── Badge.tsx         # Color-coded status badges (success, danger, warning, info)
│   │   ├── Button.tsx        # Primary, secondary, ghost, danger, and icon buttons
│   │   ├── Card.tsx          # Rounded container card with interactive hover effects
│   │   ├── CategoryPill.tsx  # Document category pill filters and icons
│   │   ├── Dialog.tsx        # Modals, mobile bottom sheets (Drawer), and ConfirmDialog
│   │   ├── Divider.tsx       # Horizontal rules with optional text label
│   │   ├── DocumentCard.tsx  # Document preview card with badge, category icon, and menu
│   │   ├── EmptyState.tsx    # Illustrated empty states with actionable CTA
│   │   ├── Input.tsx         # Form fields, password toggles, and select inputs
│   │   ├── PageHeader.tsx    # Screen title, subtitle, and back action header
│   │   ├── ProgressBar.tsx   # Storage and progression meters
│   │   ├── ReminderCard.tsx  # Reminder task card with checkbox and urgency badge
│   │   ├── SectionHeader.tsx # Content section headers with count chips
│   │   ├── Skeleton.tsx      # Loading placeholders
│   │   └── StatsCard.tsx     # KPI cards with custom icons and accent tints
│   ├── GlobalSearchModal.tsx # Command palette for vault-wide search
│   ├── NotificationsModal.tsx # Activity and expiration alerts center
│   ├── UploadModal.tsx      # Drag-and-drop document acquisition dialog
│   └── AssistantModal.tsx   # Vault AI document query assistant
├── context/
│   └── DocumentContext.tsx  # Central state management (documents, folders, reminders, search)
├── lib/
│   ├── tokens.ts            # Palette definitions, category color map, and radii tokens
│   └── utils.ts             # Tailwind classnames merger (`clsx` + `tailwind-merge`)
├── screens/                 # Code-split application view components
│   ├── LandingScreen.tsx    # Showcase marketing landing page (web preview)
│   ├── BentoHomeScreen.tsx  # Primary dashboard with quick actions and expiring alerts
│   ├── DocumentsScreen.tsx  # Vault explorer with category tabs, search, and sorting
│   ├── DocumentDetailScreen.tsx # Metadata editor, download, verify, and share controls
│   ├── UploadScreen.tsx     # Multi-step acquisition pipeline with client validation
│   ├── RemindersScreen.tsx  # Expiry scheduler and reminder list
│   ├── FoldersScreen.tsx    # Custom vault folders management
│   ├── SharedDocumentsScreen.tsx # Active sharing links and access revocation
│   ├── FavoritesScreen.tsx  # Starred documents fast access
│   ├── SettingsScreen.tsx   # User profile, language, notification preferences, export, delete
│   ├── StorageScreen.tsx    # Quota breakdown and storage visualization
│   └── HelpScreen.tsx       # FAQ, security overview, and customer support
└── services/
    ├── api.ts               # HTTP client communication with `@papertrail/api`
    └── nativeService.ts     # Capacitor Android bindings (back button, haptics, status bar)
```

---

## 3. Backend Architecture (`apps/api`)

The backend is built with NestJS 11 following strict modular boundaries and standard dependency injection.

```
apps/api/src/
├── main.ts                  # NestJS bootstrap, CORS, global validation pipe, security headers
├── app.module.ts            # Root application module with rate-limiting throttler
├── prisma/
│   ├── prisma.service.ts    # Neon PostgreSQL client connection lifecycle
│   └── prisma.module.ts     # Global database module
├── auth/
│   ├── auth.guard.ts        # Clerk JWT session verification & production fallback safeguard
│   ├── auth.controller.ts   # Profile sync, onboarding state, vault export, and account deletion
│   ├── auth.module.ts
│   └── current-user.decorator.ts # Param decorator extracting authenticated user entity
├── documents/
│   ├── documents.controller.ts # CRUD routes for vault documents
│   ├── documents.service.ts    # IDOR-protected database operations and storage quota management
│   └── documents.module.ts
├── folders/
│   ├── folders.controller.ts   # Folder listing, creation, and deletion
│   └── folders.module.ts
├── reminders/
│   ├── reminders.controller.ts # Expiry reminder scheduling, toggling, and deletion
│   ├── reminders.service.ts    # Due date computation and urgency calculation
│   └── reminders.module.ts
├── sharing/
│   ├── sharing.controller.ts   # Secure token generation, public link resolution, and revocation
│   └── sharing.module.ts
├── storage/
│   ├── storage.controller.ts   # Presigned URL generation for Cloudflare R2
│   ├── storage.service.ts      # AWS S3 Client integration, path traversal protection, quota validation
│   └── storage.module.ts
└── ocr/
    ├── ocr.controller.ts       # Document metadata extraction
    └── ocr.module.ts
```

---

## 4. End-to-End Cryptographic & Data Flows

### A. Document Upload Pipeline
```
1. Client selects file (e.g., passport.pdf, 2.4 MB)
2. Client requests pre-signed upload URL from API:
   POST /api/v1/storage/upload-url
   Payload: { filename, fileType: 'pdf', fileSizeBytes: 2516582 }
3. API validates user storage quota:
   (storageUsedBytes + fileSizeBytes <= storageQuotaBytes)
4. API generates unique S3 object key with sanitized extension:
   `users/{userId}/docs/{timestamp}-{random}.pdf`
5. API issues short-lived S3 PutObject pre-signed URL (15-min expiration)
6. Client uploads binary file directly to Cloudflare R2 via pre-signed URL (bypassing backend server load)
7. Client registers document metadata in API:
   POST /api/v1/documents
8. API records document in PostgreSQL with ownership binding: `userId: user.id`
9. API increments user storage counter atomically
```

### B. Secure Time-Limited Sharing Flow
```
1. Vault Owner generates share link:
   POST /api/v1/share { documentId, expiresInHours: 48 }
2. API validates ownership (`doc.userId === user.id`)
3. API creates unique cryptographic share token (`share_...`) with expiration timestamp
4. Recipient accesses document via public link:
   GET /api/v1/share/{token}
5. API checks `!isRevoked` and `new Date(expiresAt) > now()`
6. API returns document metadata and increments access counter
7. Owner can instantly invalidate link at any time:
   DELETE /api/v1/share/{token}/revoke
```

---

## 5. Mobile & Android Integration (`@capacitor/core`)

PaperTrail is engineered as a hybrid responsive web application and native Android container:
- In browser mode, renders the desktop framed bento canvas with left sidebar navigation and right rail widgets.
- In mobile viewport or Android APK (Capacitor), automatically collapses into a full-bleed interface with an ergonomic Bento Bottom Navigation Bar (`BentoDock.tsx`), supports native hardware back button handling, status bar coloring, and haptic feedback via `apps/web/src/services/nativeService.ts`.
