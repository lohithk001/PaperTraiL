# PaperTrail — Comprehensive REST API Reference (`/api/v1`)

**API Version:** `v1.0.0`  
**Base Protocol:** HTTPS / TLS 1.3  
**Development URL:** `http://localhost:8000/api/v1`  
**Swagger UI Documentation:** `http://localhost:8000/api/docs`  
**Authentication Scheme:** Bearer Token via Clerk Session JWT (`Authorization: Bearer <clerk_token>`)  

---

## 1. Global Request & Response Specifications

### Headers
Every authenticated request must include:
```http
Authorization: Bearer <clerk_jwt_token>
Content-Type: application/json
Accept: application/json
```

### Standard Response Envelopes
All endpoints return structured JSON envelopes conforming to `@papertrail/contracts`:

#### Success Envelope (HTTP 200, 201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

#### Error Envelope (HTTP 400, 401, 403, 404, 429, 500)
```json
{
  "statusCode": 403,
  "message": "Access denied: You do not own this document",
  "error": "Forbidden",
  "timestamp": "2026-11-08T15:30:00.000Z",
  "path": "/api/v1/documents/doc-544326"
}
```

---

## 2. Health & Telemetry Endpoint

### `GET /api/v1/health`
Probes API health, executes a live `SELECT 1` ping against Neon PostgreSQL, and measures system memory and uptime.

* **Authentication:** None (Public / Monitoring agent)
* **Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-11-08T15:32:00.000Z",
  "uptimeSeconds": 1420,
  "totalLatencyMs": 4,
  "database": {
    "engine": "Neon PostgreSQL",
    "status": "connected",
    "latencyMs": 3
  },
  "storage": {
    "engine": "Neon DB Direct Vault",
    "encryption": "AES-256-GCM",
    "isolation": "Row-level cryptographic user scoping"
  },
  "system": {
    "nodeVersion": "v22.13.0",
    "platform": "win32",
    "heapUsedMb": "48.2",
    "heapTotalMb": "64.0",
    "rssMb": "112.5"
  }
}
```

---

## 3. Authentication & Profile Endpoints

### `GET /api/v1/auth/me`
Retrieves the authenticated user's profile, vault quota, and onboarding status.

* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_99214a-8812",
    "clerkId": "user_2test123",
    "email": "user@papertrail.app",
    "fullName": "Lohith Kumar",
    "tagline": "Personal Document Vault",
    "avatarUrl": "https://img.clerk.com/...",
    "storageUsedBytes": 15518976,
    "storageQuotaBytes": 524288000,
    "encryptionEnabled": true,
    "biometricEnabled": true,
    "onboardingCompleted": true,
    "onboardingStep": 6,
    "selectedDocumentCategories": ["Insurance", "Identity", "Vehicle"],
    "preferredLanguage": "en"
  }
}
```

---

### `PATCH /api/v1/auth/onboarding`
Updates the user's progress through the multi-step onboarding wizard.

* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "step": 4,
  "displayName": "Lohith Kumar",
  "preferredLanguage": "en",
  "selectedCategories": ["Insurance", "Identity", "Vehicle", "Education"],
  "reminderPreferences": {
    "documentExpiry": true,
    "warrantyExpiry": true,
    "insuranceRenewal": true,
    "billPayment": false
  }
}
```
* **Response (200 OK):** Returns updated `User` object.

---

### `DELETE /api/v1/auth/account`
Irreversibly deletes the authenticated user's account, cascading to all documents, encrypted blobs, folders, reminders, and active share tokens.

* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Account and all associated encrypted vault records permanently deleted"
}
```

---

## 4. Document Management Endpoints

### `GET /api/v1/documents`
Lists documents with support for full-text search, category filtering, and pagination.

* **Query Parameters:**
  * `search` *(string, optional)*: Substring search across title, issuer, or tags.
  * `category` *(enum, optional)*: `Insurance` | `Identity` | `Vehicle` | `Education` | `Warranty` | `Finance` | `Medical`.
  * `filter` *(enum, optional)*: `all` | `recent` | `expiring`.
  * `sortBy` *(enum, optional)*: `date` (default) | `expiry` | `title`.
  * `page` *(number, optional)*: Page index (default: `1`).
  * `limit` *(number, optional)*: Items per page (default: `20`, max: `100`).

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc-544326",
        "userId": "usr_99214a-8812",
        "title": "Comprehensive Motor Insurance",
        "category": "Insurance",
        "fileType": "pdf",
        "fileSizeBytes": 2457600,
        "fileSizeFormatted": "2.3 MB",
        "issueDate": "2025-11-12",
        "expiryDate": "2026-11-12",
        "daysLeft": 4,
        "isExpiringSoon": true,
        "isVerified": true,
        "policyNumber": "POL-88392-GEICO",
        "issuer": "GEICO Auto Insurance",
        "notes": "Comprehensive collision & third-party liability coverage.",
        "tags": ["Insurance", "Vehicle", "Renewal"],
        "isPriority": true,
        "badgeLabel": "EXPIRING SOON",
        "badgeType": "danger"
      }
    ],
    "total": 1
  }
}
```

---

### `POST /api/v1/documents`
Ingests a new document into the vault. Validates binary magic-bytes, computes a SHA-256 duplicate checksum, and encrypts the payload using **AES-256-GCM** before writing to Neon DB.

* **Request Body:**
```json
{
  "title": "International Travel Passport",
  "category": "Identity",
  "fileType": "pdf",
  "fileSizeBytes": 1887436,
  "fileData": "data:application/pdf;base64,JVBERi0xLjQK...",
  "issueDate": "2024-08-15",
  "expiryDate": "2034-08-14",
  "issuer": "Ministry of External Affairs",
  "policyNumber": "Z8920147B",
  "notes": "Biometric passport with electronic chip.",
  "tags": ["Identity", "Travel", "Passport"],
  "isPriority": true
}
```

* **Validation Rules:**
  * `fileData` must match the magic bytes for `fileType` (e.g. `%PDF` for PDF).
  * `fileSizeBytes` cannot exceed 50 MB (`52428800` bytes).
  * `title` is required (1 to 200 characters).

* **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "doc-994821",
    "title": "International Travel Passport",
    "category": "Identity",
    "fileType": "pdf",
    "fileSizeBytes": 1887436,
    "fileSizeFormatted": "1.8 MB",
    "fileUrl": "data:application/pdf;base64,JVBERi0xLjQK...",
    "isVerified": true
  },
  "message": "Document saved to vault successfully"
}
```

* **Error Responses:**
  * `400 Bad Request`: `"Security Violation: File binary signature does not match declared file type"`

---

### `GET /api/v1/documents/:id`
Retrieves document metadata and decrypts the stored AES-256-GCM payload for the verified owner.

* **Response (200 OK):** Returns decrypted `DocumentItem`.
* **Error Responses:**
  * `403 Forbidden`: `"Access denied: You do not own this document"`
  * `404 Not Found`: `"Document with ID ... not found"`

---

### `PATCH /api/v1/documents/:id`
Updates document metadata, issuer, policy number, tags, or notes.

* **Request Body:** Partial `CreateDocumentDto`.
* **Response (200 OK):** Updated document item.

---

### `DELETE /api/v1/documents/:id`
Permanently deletes the document record, encrypted binary, and linked reminder alerts.

* **Response (200 OK):**
```json
{
  "success": true,
  "data": { "success": true },
  "message": "Document deleted successfully"
}
```

---

### `POST /api/v1/documents/:id/verify`
Marks the document record with official cryptographic verification status.

* **Response (200 OK):** Returns document with `isVerified: true`.

---

## 5. Expiry & Reminder Endpoints

### `GET /api/v1/reminders`
Lists all expiry reminders belonging to the authenticated user sorted by due date.

* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rem-449102",
      "userId": "usr_99214a-8812",
      "documentId": "doc-544326",
      "documentTitle": "Comprehensive Motor Insurance",
      "title": "Comprehensive Motor Insurance Expiration",
      "dueDate": "2026-11-12",
      "daysLeft": 4,
      "urgency": "critical",
      "isCompleted": false,
      "category": "Insurance"
    }
  ]
}
```

---

### `POST /api/v1/reminders/:id/toggle`
Toggles reminder completion status (`isCompleted: true / false`).

---

## 6. Cryptographic Sharing Endpoints

### `POST /api/v1/share`
Generates a time-limited cryptographic sharing token.

* **Request Body:**
```json
{
  "documentId": "doc-544326",
  "expiresInHours": 48
}
```

* **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "shr_8a9f24c0e817...",
    "shareUrl": "https://papertrail.app/share/shr_8a9f24c0e817...",
    "expiresAt": "2026-11-10T15:30:00.000Z"
  }
}
```

---

### `GET /api/v1/share/:token`
Resolves a public preview for an authorized share token if not expired or revoked.

* **Authentication:** None (Token verified)
* **Response (200 OK):** Returns sanitised document preview data.

---

### `POST /api/v1/share/:token/revoke`
Immediately revokes active access to a shared token. Requires document owner authentication.
