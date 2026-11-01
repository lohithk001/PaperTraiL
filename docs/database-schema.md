# PaperTrail — Database Schema & Architecture

PaperTrail utilizes **Neon Serverless PostgreSQL** managed via **Prisma ORM**.

---

## Entity Relationship Overview

```mermaid
erDiagram
    USER ||--o{ DOCUMENT : "owns"
    USER ||--o{ FOLDER : "creates"
    USER ||--o{ REMINDER : "sets"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ AUDIT_LOG : "triggers"
    USER ||--o{ SHARE_TOKEN : "authorizes"

    FOLDER ||--o{ DOCUMENT : "organizes"
    DOCUMENT ||--o{ REMINDER : "has"
    DOCUMENT ||--o{ SHARE_TOKEN : "shared_via"

    USER {
        string id PK
        string clerkId UK
        string email UK
        string fullName
        string tagline
        string avatarUrl
        bigint storageUsedBytes
        bigint storageQuotaBytes
        boolean encryptionEnabled
        boolean biometricEnabled
        datetime createdAt
        datetime updatedAt
    }

    DOCUMENT {
        string id PK
        string userId FK
        string folderId FK
        string title
        enum category
        string fileKey UK
        string fileType
        int fileSizeBytes
        date issueDate
        date expiryDate
        boolean isVerified
        string policyNumber
        string issuer
        text notes
        text ocrText
        string[] tags
        boolean isPriority
        datetime createdAt
        datetime updatedAt
    }

    REMINDER {
        string id PK
        string userId FK
        string documentId FK
        string title
        date dueDate
        enum urgency
        boolean isCompleted
        datetime createdAt
        datetime updatedAt
    }

    FOLDER {
        string id PK
        string userId FK
        string name
        string color
        string icon
        datetime createdAt
    }

    NOTIFICATION {
        string id PK
        string userId FK
        string title
        string message
        enum type
        boolean isRead
        json metadata
        datetime createdAt
    }

    SHARE_TOKEN {
        string id PK
        string token UK
        string documentId FK
        string createdByUserId FK
        datetime expiresAt
        int accessCount
        boolean isRevoked
        datetime createdAt
    }

    AUDIT_LOG {
        string id PK
        string userId FK
        string action
        string resourceType
        string resourceId
        string ipAddress
        datetime createdAt
    }
```

---

## Detailed Table Specifications

### 1. `User`
Stores root account identity synchronized from Clerk, along with storage limits and security preferences.
- `id`: UUID Primary Key.
- `clerkId`: Clerk user identifier (e.g. `user_2t...`), indexed with a unique constraint.
- `email`: Normalized primary email address.
- `storageUsedBytes`: Current sum of all stored file sizes.
- `storageQuotaBytes`: Hard storage ceiling (default: `524,288,000` = 500 MB).

### 2. `Document`
Core vault record.
- `fileKey`: Unique object path in Cloudflare R2 (`users/{userId}/docs/{timestamp}-{hash}.{ext}`).
- `category`: Enum (`Insurance`, `Identity`, `Vehicle`, `Education`, `Warranty`, `Finance`, `Medical`).
- `expiryDate`: Optional date used by the expiration countdown math.
- `isVerified`: Authenticity verification flag.
- `ocrText`: Asynchronously populated text extracted via the Gemini/Vision OCR worker.

### 3. `Reminder`
Tracks document renewal dates and warranties.
- `urgency`: Enum computed from days remaining (`critical` < 15 days, `warning` < 45 days, `normal`).
- `isCompleted`: Indicates whether the user has addressed or renewed the document.
- Cascades on document deletion (`onDelete: Cascade`).

### 4. `ShareToken`
Manages time-limited public document access.
- `token`: Unique URL slug.
- `expiresAt`: Hard expiration timestamp (default: 48 hours).
- `isRevoked`: Allows instant manual revocation.
- `accessCount`: Monitored view counter.
