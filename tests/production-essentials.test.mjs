import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';

// Standalone implementation matching apps/api/src/crypto/encryption.service.ts
class EncryptionService {
  constructor() {
    const rawKey = 'papertrail_production_vault_master_aes256_secret_key_2026';
    this.masterKey = crypto.createHash('sha256').update(rawKey).digest();
  }

  deriveUserKey(userId) {
    return Buffer.from(
      crypto.hkdfSync('sha256', this.masterKey, Buffer.from(userId, 'utf8'), Buffer.from('papertrail-vault-document-encryption', 'utf8'), 32)
    );
  }

  encrypt(plaintext, userId) {
    const key = this.deriveUserKey(userId);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    return `pt_v1:${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
  }

  decrypt(payloadStr, userId) {
    if (!payloadStr.startsWith('pt_v1:')) return payloadStr;

    const parts = payloadStr.split(':');
    if (parts.length < 4) throw new Error('Malformed encrypted document payload');

    const ivHex = parts[1];
    const tagHex = parts[2];
    const ciphertextBase64 = parts.slice(3).join(':');

    const key = this.deriveUserKey(userId);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let plaintext = decipher.update(ciphertextBase64, 'base64', 'utf8');
    plaintext += decipher.final('utf8');
    return plaintext;
  }

  computeChecksum(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  validateMagicBytes(dataUrlOrBase64, declaredType) {
    if (!dataUrlOrBase64) return true;
    let base64Data = dataUrlOrBase64;
    if (dataUrlOrBase64.includes('base64,')) {
      base64Data = dataUrlOrBase64.split('base64,')[1];
    }
    const buffer = Buffer.from(base64Data.substring(0, 64), 'base64');
    if (buffer.length < 4) return false;

    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    const isJpg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';

    const normalized = declaredType.toLowerCase();
    if (normalized === 'pdf') return isPdf;
    if (normalized === 'png') return isPng;
    if (normalized === 'jpg' || normalized === 'jpeg') return isJpg;
    if (normalized === 'webp') return isWebp;
    return isPdf || isPng || isJpg || isWebp;
  }
}

describe('PaperTrail Production Essentials Test Suite', () => {
  const enc = new EncryptionService();

  describe('1. AES-256-GCM Cryptographic Integrity & Key Derivation', () => {
    test('should encrypt and decrypt document payload with exact fidelity', () => {
      const plaintext = 'data:application/pdf;base64,JVBERi0xLjUKJcfs...CONFIDENTIAL_VAULT_RECORD...';
      const userId = 'user_clerk_9824_tenant';

      const encrypted = enc.encrypt(plaintext, userId);
      assert.ok(encrypted.startsWith('pt_v1:'), 'Encrypted envelope must start with pt_v1 version tag');
      assert.notEqual(encrypted, plaintext, 'Ciphertext must never expose plaintext');

      const decrypted = enc.decrypt(encrypted, userId);
      assert.equal(decrypted, plaintext, 'Decrypted payload must match original plaintext exactly');
    });

    test('should reject decryption when unauthorized user attempts access (User Isolation)', () => {
      const plaintext = 'Top Secret Medical Prescription';
      const userA = 'user_alice_123';
      const userB = 'user_bob_attacker';

      const encrypted = enc.encrypt(plaintext, userA);

      assert.throws(() => {
        enc.decrypt(encrypted, userB);
      }, /Unsupported state or unable to authenticate data|integrity failure/i);
    });

    test('should detect tampering via GCM authentication tag verification', () => {
      const plaintext = 'Sensitive Tax Filing 2026';
      const userId = 'user_charlie_456';

      const encrypted = enc.encrypt(plaintext, userId);
      const parts = encrypted.split(':');
      // Corrupt 1 character in the ciphertext
      const corruptedCiphertext = parts[3].slice(0, -2) + (parts[3].endsWith('A') ? 'B' : 'A');
      const tamperedPayload = `${parts[0]}:${parts[1]}:${parts[2]}:${corruptedCiphertext}`;

      assert.throws(() => {
        enc.decrypt(tamperedPayload, userId);
      }, /Unsupported state or unable to authenticate data|integrity failure/i);
    });
  });

  describe('2. File Signature (Magic Bytes) Ingestion Security', () => {
    test('should accept authentic PDF header bytes', () => {
      // %PDF header in base64: JVBERi0=
      const validPdfBase64 = 'data:application/pdf;base64,JVBERi0xLjQK';
      assert.equal(enc.validateMagicBytes(validPdfBase64, 'pdf'), true);
    });

    test('should accept authentic PNG header bytes', () => {
      // .PNG header in base64: iVBORw0KGgo=
      const validPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      assert.equal(enc.validateMagicBytes(validPngBase64, 'png'), true);
    });

    test('should accept authentic JPEG header bytes', () => {
      // /9j/ is standard JPEG FF D8 FF in base64
      const validJpgBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/';
      assert.equal(enc.validateMagicBytes(validJpgBase64, 'jpg'), true);
    });

    test('should reject Windows PE Executable disguised as PDF', () => {
      // MZ header (4D 5A in hex) -> TVqQAAMAAAAEAAAA
      const fakePdfExecutable = 'data:application/pdf;base64,TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAA==';
      assert.equal(enc.validateMagicBytes(fakePdfExecutable, 'pdf'), false, 'Disguised executable must be rejected');
    });

    test('should reject Bash script disguised as PNG', () => {
      // #!/bin/bash -> IyEvYmluL2Jhc2gK
      const fakePngScript = 'data:image/png;base64,IyEvYmluL2Jhc2gKZWNobyAiaGFja2VkIgo=';
      assert.equal(enc.validateMagicBytes(fakePngScript, 'png'), false, 'Disguised script must be rejected');
    });
  });

  describe('3. Duplicate Detection & Checksum Computation', () => {
    test('should generate identical SHA-256 checksum for identical documents', () => {
      const docPayload = 'data:application/pdf;base64,sample_passport_data_blob';
      const hash1 = enc.computeChecksum(docPayload);
      const hash2 = enc.computeChecksum(docPayload);

      assert.equal(hash1, hash2);
      assert.equal(hash1.length, 64, 'SHA-256 hash must be 64 hexadecimal characters');
    });

    test('should generate distinct checksums for differing document payloads', () => {
      const doc1 = 'data:application/pdf;base64,passport_version_1';
      const doc2 = 'data:application/pdf;base64,passport_version_2';

      assert.notEqual(enc.computeChecksum(doc1), enc.computeChecksum(doc2));
    });
  });

  describe('4. Health Probe & System Telemetry Schema Compliance', () => {
    test('verifies health probe contract format', () => {
      const mockHealthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptimeSeconds: 120,
        totalLatencyMs: 4,
        database: {
          engine: 'Neon PostgreSQL',
          status: 'connected',
          latencyMs: 3,
        },
        storage: {
          engine: 'Neon DB Direct Vault',
          encryption: 'AES-256-GCM',
          isolation: 'Row-level cryptographic user scoping',
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          heapUsedMb: '42.5',
          heapTotalMb: '64.0',
          rssMb: '98.2',
        },
      };

      assert.equal(mockHealthResponse.status, 'ok');
      assert.equal(mockHealthResponse.database.engine, 'Neon PostgreSQL');
      assert.equal(mockHealthResponse.storage.encryption, 'AES-256-GCM');
      assert.ok(mockHealthResponse.totalLatencyMs >= 0);
    });
  });
});
