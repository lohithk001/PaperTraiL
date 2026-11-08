import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface EncryptedPayload {
  version: 'pt_v1';
  iv: string;
  tag: string;
  data: string;
}

@Injectable()
export class EncryptionService {
  // Master server secret key (in production loaded from VAULT_MASTER_KEY environment variable)
  private readonly masterKey: Buffer;

  constructor() {
    const rawKey = process.env.VAULT_MASTER_KEY || 'papertrail_production_vault_master_aes256_secret_key_2026';
    // Derive a strict 32-byte (256-bit) master key using SHA-256
    this.masterKey = crypto.createHash('sha256').update(rawKey).digest();
  }

  /**
   * Derive tenant/user-isolated 256-bit key using HKDF (RFC 5869)
   */
  private deriveUserKey(userId: string): Buffer {
    return Buffer.from(
      crypto.hkdfSync('sha256', this.masterKey, Buffer.from(userId, 'utf8'), Buffer.from('papertrail-vault-document-encryption', 'utf8'), 32)
    );
  }

  /**
   * Encrypt document payload using military-grade AES-256-GCM
   * Reviewed cryptographic standard providing authenticated encryption (confidentiality + integrity).
   */
  encrypt(plaintext: string, userId: string): string {
    const key = this.deriveUserKey(userId);
    // 12-byte initialization vector (standard recommendation for GCM)
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    // Serialized envelope: pt_v1:<iv_hex>:<tag_hex>:<ciphertext_base64>
    return `pt_v1:${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
  }

  /**
   * Decrypt AES-256-GCM ciphertext verifying authentication tag
   */
  decrypt(payloadStr: string, userId: string): string {
    if (!payloadStr.startsWith('pt_v1:')) {
      // Unencrypted legacy fallback or plain data URL
      return payloadStr;
    }

    const parts = payloadStr.split(':');
    if (parts.length < 4) {
      throw new BadRequestException('Malformed encrypted document payload');
    }

    const ivHex = parts[1];
    const tagHex = parts[2];
    const ciphertextBase64 = parts.slice(3).join(':');

    const key = this.deriveUserKey(userId);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    try {
      let plaintext = decipher.update(ciphertextBase64, 'base64', 'utf8');
      plaintext += decipher.final('utf8');
      return plaintext;
    } catch (err) {
      throw new BadRequestException('Cryptographic integrity failure: document payload tampered or unauthorized key');
    }
  }

  /**
   * Compute deterministic SHA-256 content checksum for duplicate document detection
   */
  computeChecksum(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Validate file binary magic bytes to prevent disguised executable uploads
   */
  validateMagicBytes(dataUrlOrBase64: string, declaredType: string): boolean {
    if (!dataUrlOrBase64) return true;

    let base64Data = dataUrlOrBase64;
    if (dataUrlOrBase64.includes('base64,')) {
      base64Data = dataUrlOrBase64.split('base64,')[1];
    }

    const buffer = Buffer.from(base64Data.substring(0, 64), 'base64');
    if (buffer.length < 4) return false;

    // Signatures
    const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47; // .PNG
    const isJpg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF; // JPEG
    const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';

    const normalized = declaredType.toLowerCase();
    if (normalized === 'pdf') return isPdf;
    if (normalized === 'png') return isPng;
    if (normalized === 'jpg' || normalized === 'jpeg') return isJpg;
    if (normalized === 'webp') return isWebp;

    return isPdf || isPng || isJpg || isWebp;
  }
}
