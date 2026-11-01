# PaperTrail — REST API Reference (`/api/v1`)

The PaperTrail centralized backend provides versioned RESTful endpoints consumed by both **PaperTrail Web** and **PaperTrail Mobile**.

- **Development Base URL**: `http://localhost:8000/api/v1`
- **Interactive Swagger Docs**: `http://localhost:8000/api/docs`
- **Authentication**: Bearer Token in `Authorization` header (`Bearer <clerk_session_jwt>`)

---

## 1. Authentication Endpoints

### `GET /api/v1/auth/me`
Retrieves the authenticated user's profile, vault settings, and storage metrics.

**Headers**:
```http
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "usr_99214a",
    "clerkId": "user_2test123",
    "email": "lohith.k@vault.io",
    "fullName": "Lohith Kumar",
    "tagline": "Personal Document Vault",
    "storageUsedBytes": 15518976,
    "storageQuotaBytes": 524288000,
    "encryptionEnabled": true,
    "biometricEnabled": true
  }
}
```

---

## 2. Storage & Upload Endpoints

### `POST /api/v1/storage/upload-url`
Issues a signed, short-lived Cloudflare R2 upload URL for direct file upload.

**Request Body**:
```json
{
  "filename": "geico-auto-insurance.pdf",
  "fileType": "pdf",
  "fileSizeBytes": 2516582
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://<account-id>.r2.cloudflarestorage.com/papertrail-vault/users/usr_99214a/docs/1730456000-xyz.pdf?X-Amz-Signature=...",
    "fileKey": "users/usr_99214a/docs/1730456000-xyz.pdf",
    "expiresAt": "2026-11-01T12:30:00.000Z",
    "maxSizeBytes": 2516582
  }
}
```

### `GET /api/v1/storage/info`
Returns current user storage capacity, usage bytes, and percentage.

---

## 3. Documents Endpoints

### `GET /api/v1/documents`
Lists documents with support for search, category filtering, and sorting.

**Query Parameters**:
- `search` *(optional)*: Substring query across title, category, issuer, and tags.
- `category` *(optional)*: `Insurance` | `Identity` | `Vehicle` | `Education` | `Warranty` | `Finance` | `Medical`.
- `filter` *(optional)*: `all` | `recent` | `expiring`.
- `sortBy` *(optional)*: `date` (default) | `expiry` | `title`.
- `page` *(optional)*: Page number (default: 1).
- `limit` *(optional)*: Records per page (default: 20).

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc-1",
        "title": "Vehicle Insurance Policy",
        "category": "Insurance",
        "fileKey": "users/usr_99214a/docs/geico-auto-policy.pdf",
        "fileType": "pdf",
        "fileSizeBytes": 2516582,
        "fileSizeFormatted": "2.4 MB",
        "issueDate": "2025-11-12",
        "expiryDate": "2026-11-12",
        "daysLeft": 12,
        "isExpiringSoon": true,
        "isVerified": true,
        "policyNumber": "POL-88392-GEICO",
        "issuer": "GEICO Auto Insurance",
        "tags": ["Automobile", "Geico"]
      }
    ],
    "total": 1
  }
}
```

### `GET /api/v1/documents/:id`
Retrieves a single document along with an on-demand presigned download/view URL.

### `POST /api/v1/documents`
Saves new document metadata to the vault after file upload has succeeded in Cloudflare R2.

**Request Body**:
```json
{
  "title": "MacBook Pro AppleCare Warranty",
  "category": "Warranty",
  "fileKey": "users/usr_99214a/docs/applecare.pdf",
  "fileType": "pdf",
  "fileSizeBytes": 890000,
  "issueDate": "2024-12-15",
  "expiryDate": "2026-12-15",
  "issuer": "Apple Inc.",
  "policyNumber": "APL-CARE-M3-9941",
  "tags": ["Warranty", "Electronics", "Laptop"]
}
```

### `PATCH /api/v1/documents/:id`
Updates title, notes, tags, or expiration date.

### `DELETE /api/v1/documents/:id`
Deletes a document from PostgreSQL, decrements user storage usage, and removes linked reminders.

### `POST /api/v1/documents/:id/verify`
Marks document authenticity status as verified.

---

## 4. Reminders & Expiration Alerts

### `GET /api/v1/reminders`
Lists all active and completed renewal reminders for the authenticated user.

### `POST /api/v1/reminders`
Creates a new reminder associated with a document.
```json
{
  "documentId": "doc-1",
  "title": "Renew Geico Car Insurance before lapse",
  "dueDate": "2026-11-12"
}
```

### `POST /api/v1/reminders/:id/toggle`
Toggles reminder completion/resolved status.

---

## 5. Document Sharing

### `POST /api/v1/share`
Generates a short-lived tokenized public access link.
```json
{
  "documentId": "doc-1",
  "expiresInHours": 48
}
```

### `GET /api/v1/share/:token`
Public endpoint allowing recipients to view the shared document within the validity window.

---

## 6. OCR & Text Extraction

### `POST /api/v1/ocr/extract`
Triggers Gemini API document parsing for auto-classification and expiration detection.
```json
{
  "fileKey": "users/usr_99214a/docs/scanned-card.jpg"
}
```

---

## Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": ["Filename is required", "fileSizeBytes must be a positive number"],
  "error": "Bad Request",
  "timestamp": "2026-11-01T12:00:00.000Z",
  "path": "/api/v1/storage/upload-url"
}
```
