# PaperTrail — Data Protection & Regulatory Compliance Specification
## Compliance with India's Digital Personal Data Protection Act, 2023 (DPDP Act) & GDPR

**Statutory Framework:** Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, Republic of India)  
**Applicability:** Digital document custody, processing, and storage within India and cross-border  
**Classification:** PaperTrail operates as a **Data Fiduciary**; the User is the **Data Principal**  
**Grievance Redressal Officer:** `grievance@papertrail.app`  

---

## 1. Compliance Architecture Overview

PaperTrail is built to meet the rigorous obligations set forth under the **Digital Personal Data Protection Act, 2023 (DPDP Act)** and European Union **General Data Protection Regulation (GDPR)**:

```
┌─────────────────────────────────────────────────────────────┐
│                       Data Principal                        │
│             (User with Sovereign Document Rights)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
            Informed Consent & Granular Permissions
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Fiduciary (PaperTrail)               │
│       - Purpose Limitation (Storage, Reminders, Search)      │
│       - Zero-Knowledge AES-256-GCM Envelope Encryption       │
│       - Transparent Retention & Cascading Erasure           │
│       - 72-Hour Grievance Redressal SLA                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                  Atomic Storage & Deletion
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Neon PostgreSQL Vault                     │
│               - Out-of-line TOAST Tables                    │
│               - Row-Level Tenant Ownership                  │
│               - Immediate Cascading Cryptographic Purge     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Data Principal Rights & In-App Capabilities

| DPDP Act Section | Data Principal Right | PaperTrail Technical Implementation |
| :--- | :--- | :--- |
| **Section 11** | **Right to Access Information** | Users can inspect all stored documents, metadata, audit logs, and storage metrics directly in the Dashboard and Bento UI. |
| **Section 12** | **Right to Correction & Erasure** | Dedicated editing modal to correct metadata. Immediate permanent deletion of document records and TOAST file data (`DELETE /api/v1/documents/:id`). |
| **Section 13** | **Right of Grievance Redressal** | Direct grievance pathway to our designated Data Protection Officer with statutory 72-hour turnaround guarantees. |
| **Section 14** | **Right to Nominate** | In-app feature allowing users to designate authorized emergency sharing contacts for critical credentials in the event of incapacitation. |

---

## 3. Purpose Limitation & Data Minimization

Under Section 6 of the DPDP Act, personal data must be processed solely for specific, declared purposes:

1. **Declared Purposes:**
   * Secure, encrypted custody of user-uploaded personal records (passports, insurance, licenses, diplomas, warranties).
   * Calculating expiration dates and dispatching lifecycle renewal reminders (30, 15, and 3 days before expiry).
   * Providing full-text search and OCR metadata extraction.
   * Fulfilling user-initiated cryptographic shares with time-delimited access.
2. **Prohibited Activities:**
   * **Zero Third-Party Model Training:** Personal documents are never fed into public foundation models.
   * **Zero Advertising / Data Brokerage:** Document metadata, email addresses, and identities are never sold, leased, or monetized.

---

## 4. Technical Safeguards & Security Measures (Section 8)

PaperTrail implements reasonable security safeguards to prevent personal data breaches:
* **AES-256-GCM Authenticated Encryption:** Ciphertext envelopes stored at rest with individual user HKDF key derivation.
* **Integrity Tagging:** 16-byte authentication tags prevent ciphertext tampering or unauthorized bit modification.
* **Transport Security:** Strict enforcement of TLS 1.3 across all client-to-server and server-to-database connections.
* **Anti-Spoofing Binary Inspection:** Real binary magic-bytes verified on ingestion to block malicious executables.
* **Sensitive Log Scrubbing:** Confidential fields (`fileData`, `password`, `token`, `secret`, `ocrText`) stripped from console logs before emission.

---

## 5. Account Deletion & Permanent Erasure Guarantee

When a Data Principal exercises their right to erasure under Section 12:
1. The user requests account deletion in [`apps/web/src/screens/SettingsScreen.tsx`](file:///c:/Users/lohit/Downloads/PaperTraiL/apps/web/src/screens/SettingsScreen.tsx) or via `DELETE /api/v1/auth/account`.
2. The database executes an atomic cascading delete (`onDelete: Cascade` in `prisma/schema.prisma`):
   * Purges user identity, session bindings, and Clerk synchronization.
   * Purges all `Document` rows and their compressed TOAST binary payloads.
   * Purges all linked `Reminder`, `Notification`, and `ShareToken` records.
3. Cryptographic user subkeys are immediately destroyed, rendering any residual memory buffers unrecoverable.
4. Leaves zero archival shadow data or retention lag.

---

## 6. Grievance Officer Contact Details

In compliance with DPDP statutory requirements, PaperTrail has appointed a dedicated Data Protection & Grievance Officer:

* **Name / Title:** Data Protection Grievance Officer, PaperTrail Inc.
* **Official Grievance Email:** `grievance@papertrail.app`
* **Security & Breach Reporting:** `security@papertrail.app`
* **Response Window:** Formal acknowledgment within 24 hours; resolution within 72 business hours.
* **Mailing Address:** PaperTrail Inc., Cyber Gateway Hub, Bangalore, Karnataka, India / Remote Global Custody.
