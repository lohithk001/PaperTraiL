# PaperTrail — Comprehensive Security & Cryptographic Architecture

**Document Version:** 2.0.0 (Production Security Standard)  
**Security Level:** Defense-Grade / Multi-Tenant Isolation  
**Lead Architect:** PaperTrail Information Security & Cryptography Practice  

---

## 1. Cryptographic Standards & Algorithms

PaperTrail utilizes only peer-reviewed, industry-standard cryptographic algorithms natively supported by the Node.js `node:crypto` standard library. No proprietary or experimental encryption routines are used.

| Cryptographic Primitive | Standard / RFC | Key Size / Parameters | Purpose |
| :--- | :--- | :--- | :--- |
| **Symmetric Cipher** | NIST SP 800-38D (**AES-256-GCM**) | 256 bits (32 bytes) | Authenticated encryption of document payloads |
| **Key Derivation** | RFC 5869 (**HKDF-SHA256**) | 256 bits output | Deriving user-isolated encryption keys |
| **Hash Function** | FIPS 180-4 (**SHA-256**) | 256 bits digest | Checksum duplicate detection & token hashing |
| **Session Signatures** | RFC 7519 (**JWT RS256**) | RSA 2048-bit asymmetric | Clerk session authentication tokens |
| **Transport Layer** | IETF RFC 8446 (**TLS 1.3**) | Modern cipher suites | End-to-end transport encryption |

---

## 2. Authenticated Envelope Encryption (AES-256-GCM)

Document binaries (PDFs, images) are never stored in plaintext. Before committing any document to Neon PostgreSQL, the `EncryptionService` executes authenticated envelope encryption:

### Step 1: User-Isolated Key Derivation via HKDF
```typescript
private deriveUserKey(userId: string): Buffer {
  return Buffer.from(
    crypto.hkdfSync(
      'sha256', 
      this.masterKey, 
      Buffer.from(userId, 'utf8'), 
      Buffer.from('papertrail-vault-document-encryption', 'utf8'), 
      32
    )
  );
}
```
* **Master Key:** 256-bit server-level master key (`VAULT_MASTER_KEY`).
* **Salt:** Authenticated user UUID (`userId`).
* **Info Context:** `"papertrail-vault-document-encryption"`.
* **Guarantee:** If an attacker compromises one user's derived key, they gain zero mathematical ability to decrypt records belonging to any other tenant in the system.

### Step 2: Galois/Counter Mode (GCM) Authenticated Encryption
```typescript
encrypt(plaintext: string, userId: string): string {
  const key = this.deriveUserKey(userId);
  const iv = crypto.randomBytes(12); // NIST recommended 12-byte random IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const authTag = cipher.getAuthTag(); // 16-byte authentication tag

  return `pt_v1:${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
}
```

### Step 3: Decryption & Tamper Detection
```typescript
decrypt(payloadStr: string, userId: string): string {
  const parts = payloadStr.split(':');
  const iv = Buffer.from(parts[1], 'hex');
  const authTag = Buffer.from(parts[2], 'hex');
  const ciphertextBase64 = parts.slice(3).join(':');

  const key = this.deriveUserKey(userId);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag); // Enforces tag verification

  let plaintext = decipher.update(ciphertextBase64, 'base64', 'utf8');
  plaintext += decipher.final('utf8'); // Throws if tag is invalid
  return plaintext;
}
```
* **Integrity Tag Verification:** If even a single bit in the ciphertext or IV is altered, `decipher.final()` throws an exception and halts execution before any unverified plaintext is emitted.

---

## 3. Ingestion Security & Magic-Bytes Anti-Spoofing

To protect against malicious code injection, PaperTrail inspects real binary headers (magic numbers) at the ingestion boundary:

```typescript
validateMagicBytes(dataUrlOrBase64: string, declaredType: string): boolean {
  const buffer = Buffer.from(base64Data.substring(0, 64), 'base64');

  const isPdf  = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
  const isPng  = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47; // \x89PNG
  const isJpg  = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;                         // JPEG
  const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';

  const normalized = declaredType.toLowerCase();
  if (normalized === 'pdf') return isPdf;
  if (normalized === 'png') return isPng;
  if (normalized === 'jpg' || normalized === 'jpeg') return isJpg;
  if (normalized === 'webp') return isWebp;
  return isPdf || isPng || isJpg || isWebp;
}
```
Any disguised executable (e.g. Windows PE `.exe` starting with `MZ` `0x4D 0x5A` or shell scripts starting with `#!/bin`) renamed to `.pdf` is immediately blocked with `400 Bad Request`.

---

## 4. Insecure Direct Object Reference (IDOR) Protection

Every document, folder, and reminder query enforces database-level tenant isolation:

```typescript
const dbDoc = await this.prisma.document.findUnique({ where: { id } });

if (dbDoc && dbDoc.userId !== user.id) {
  throw new ForbiddenException('Access denied: You do not own this document');
}
```
Even if an attacker discovers or guesses a valid document UUID (`doc-544326`), attempting to read, update, or delete it triggers an immediate `403 Forbidden` response and an audit log event.

---

## 5. Sensitive Data Log Sanitization

To ensure confidential documents, policy numbers, and credentials never appear in server log aggregators or APM tools (e.g., Datadog, Grafana Loki, CloudWatch), a global `LoggingInterceptor` scrubs all incoming and outgoing payloads:

```typescript
const sensitiveKeys = [
  'fileData',
  'password',
  'token',
  'authorization',
  'secret',
  'ocrText',
  'policyNumber',
  'encryptionKey',
];
```
Any matching key is replaced with `[REDACTED_CONFIDENTIAL]` before console output.

---

## 6. Rate Limiting & DoS Mitigation

Configured via `@nestjs/throttler` in `AppModule`:
* **Bucket Window:** 60,000 ms (1 minute).
* **Maximum Requests:** 120 requests per client IP per window.
* **Exceeded Action:** Immediate HTTP `429 Too Many Requests` with `Retry-After` header.
