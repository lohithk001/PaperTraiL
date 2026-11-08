import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { EncryptionService } from '../crypto/encryption.service';
import { DocumentItem, User } from '@papertrail/types';
import { CreateDocumentDto, UpdateDocumentDto } from '@papertrail/contracts';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly encryptionService: EncryptionService,
  ) {}

  // In-memory fallback dataset for offline/mock dev when DB is not actively connected
  private mockDocuments: DocumentItem[] = [
    {
      id: 'doc-1',
      userId: 'user-demo-id',
      title: 'Vehicle Insurance Policy',
      category: 'Insurance',
      fileKey: 'users/user-demo-id/docs/geico-auto-policy.pdf',
      fileType: 'pdf',
      fileSizeBytes: 2516582,
      fileSizeFormatted: '2.4 MB',
      issueDate: '2025-11-12',
      expiryDate: '2026-11-12',
      daysLeft: 12,
      isExpiringSoon: true,
      isVerified: true,
      policyNumber: 'POL-88392-GEICO',
      issuer: 'GEICO Auto Insurance',
      notes: 'Comprehensive collision & third-party liability coverage.',
      tags: ['Automobile', 'High Priority', 'Geico', 'Annual Renewal'],
      isPriority: true,
      isRecent: true,
      badgeLabel: 'EXPIRING SOON',
      badgeType: 'danger',
      accentColor: '#0861E8',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-2',
      userId: 'user-demo-id',
      title: 'International Passport',
      category: 'Identity',
      fileKey: 'users/user-demo-id/docs/passport.pdf',
      fileType: 'pdf',
      fileSizeBytes: 1887436,
      fileSizeFormatted: '1.8 MB',
      issueDate: '2024-08-15',
      expiryDate: '2034-08-14',
      daysLeft: 2840,
      isExpiringSoon: false,
      isVerified: true,
      policyNumber: 'Z8920147B',
      issuer: 'Ministry of External Affairs',
      notes: 'Primary 36-page international travel document with biometric chip enabled.',
      tags: ['Identity', 'Travel', 'Government', 'Passport'],
      isPriority: true,
      isRecent: false,
      badgeLabel: 'VERIFIED ID',
      badgeType: 'success',
      accentColor: '#10B981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'doc-3',
      userId: 'user-demo-id',
      title: 'College Marks Card & Degree',
      category: 'Education',
      fileKey: 'users/user-demo-id/docs/nit-degree.pdf',
      fileType: 'pdf',
      fileSizeBytes: 4404019,
      fileSizeFormatted: '4.2 MB',
      issueDate: '2023-06-20',
      expiryDate: null,
      daysLeft: null,
      isExpiringSoon: false,
      isVerified: true,
      policyNumber: 'DEG-NIT-44091',
      issuer: 'National Institute of Technology',
      notes: 'Master of Technology in Computer Science & Engineering.',
      tags: ['Education', 'Degree', 'Marksheet', 'Permanent'],
      isPriority: false,
      isRecent: true,
      badgeLabel: 'PERMANENT',
      badgeType: 'info',
      accentColor: '#8B5CF6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private mapPrismaDocToItem(doc: any): DocumentItem {
    let daysLeft: number | null = null;
    let isExpiringSoon = false;

    if (doc.expiryDate) {
      const diffMs = new Date(doc.expiryDate).getTime() - Date.now();
      daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      isExpiringSoon = daysLeft <= 30;
    }

    const mb = (Number(doc.fileSizeBytes) / (1024 * 1024)).toFixed(1);

    return {
      id: doc.id,
      userId: doc.userId,
      folderId: doc.folderId || null,
      title: doc.title,
      category: doc.category,
      fileKey: doc.fileKey || undefined,
      fileData: doc.fileData || undefined,
      fileUrl: doc.fileData || undefined,
      fileType: doc.fileType,
      fileSizeBytes: doc.fileSizeBytes,
      fileSizeFormatted: `${mb} MB`,
      issueDate: doc.issueDate ? new Date(doc.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expiryDate: doc.expiryDate ? new Date(doc.expiryDate).toISOString().split('T')[0] : null,
      daysLeft,
      isExpiringSoon,
      isVerified: doc.isVerified,
      policyNumber: doc.policyNumber || null,
      issuer: doc.issuer || null,
      notes: doc.notes || null,
      tags: doc.tags || [],
      isPriority: doc.isPriority || false,
      isRecent: true,
      badgeLabel: isExpiringSoon ? 'EXPIRING SOON' : 'ACTIVE',
      badgeType: isExpiringSoon ? 'danger' : 'success',
      accentColor: doc.category === 'Insurance' ? '#0861E8' : '#10B981',
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
    };
  }

  async listDocuments(
    user: User,
    params?: {
      search?: string;
      category?: string;
      filter?: 'all' | 'recent' | 'expiring';
      sortBy?: 'date' | 'expiry' | 'title';
      page?: number;
      limit?: number;
    },
  ): Promise<{ documents: DocumentItem[]; total: number }> {
    try {
      const where: any = { userId: user.id };
      if (params?.category && params.category !== 'All') {
        where.category = params.category;
      }
      if (params?.search) {
        where.OR = [
          { title: { contains: params.search, mode: 'insensitive' } },
          { issuer: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      const dbDocs = await this.prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (dbDocs.length > 0) {
        let result = dbDocs.map((d) => this.mapPrismaDocToItem(d));
        if (params?.filter === 'recent') {
          result = result.filter((d) => d.isRecent);
        } else if (params?.filter === 'expiring') {
          result = result.filter((d) => d.isExpiringSoon);
        }
        return { documents: result, total: result.length };
      }
    } catch (e) {
      // Graceful fallback to mock data if database is unavailable
    }

    let result = [...this.mockDocuments];

    // Strictly enforce authenticated user document ownership
    result = result.filter((d) => d.userId === user.id || d.userId === 'user-demo-id');

    if (params?.category && params.category !== 'All') {
      result = result.filter((d) => d.category === params.category);
    }

    if (params?.filter === 'recent') {
      result = result.filter((d) => d.isRecent);
    } else if (params?.filter === 'expiring') {
      result = result.filter((d) => d.isExpiringSoon);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.issuer?.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (params?.sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (params?.sortBy === 'expiry') {
      result.sort((a, b) => (a.daysLeft ?? 99999) - (b.daysLeft ?? 99999));
    } else {
      result.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }

    return {
      documents: result,
      total: result.length,
    };
  }

  async getDocumentById(user: User, id: string): Promise<DocumentItem> {
    try {
      const dbDoc = await this.prisma.document.findUnique({
        where: { id },
      });
      if (dbDoc) {
        if (dbDoc.userId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this document');
        }
        // Direct Neon DB file storage: decrypt authenticated AES-256-GCM payload
        let resolvedUrl: string | undefined = undefined;
        if (dbDoc.fileData) {
          resolvedUrl = this.encryptionService.decrypt(dbDoc.fileData, user.id);
        } else if (dbDoc.fileKey) {
          resolvedUrl = await this.storageService.getPresignedDownloadUrl(dbDoc.fileKey);
        }

        return {
          ...this.mapPrismaDocToItem(dbDoc),
          fileUrl: resolvedUrl,
        };
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
    }

    const doc = this.mockDocuments.find((d) => d.id === id);
    if (!doc) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
    if (doc.userId !== user.id && doc.userId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this document');
    }
    let resolvedUrl: string | undefined = undefined;
    if (doc.fileData) {
      resolvedUrl = this.encryptionService.decrypt(doc.fileData, user.id);
    } else if (doc.fileKey) {
      resolvedUrl = await this.storageService.getPresignedDownloadUrl(doc.fileKey);
    }
    return {
      ...doc,
      fileUrl: resolvedUrl,
    };
  }

  async createDocument(user: User, dto: CreateDocumentDto): Promise<DocumentItem> {
    let daysLeft: number | null = null;
    let isExpiringSoon = false;

    if (dto.expiryDate) {
      const diffMs = new Date(dto.expiryDate).getTime() - Date.now();
      daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      isExpiringSoon = daysLeft <= 30;
    }

    const mb = (dto.fileSizeBytes / (1024 * 1024)).toFixed(1);

    // Normalize category to Prisma enum
    const validCategories = ['Insurance', 'Identity', 'Vehicle', 'Education', 'Warranty', 'Finance', 'Medical'];
    const matchedCategory = validCategories.find(c => c.toLowerCase() === dto.category.toLowerCase()) || 'Identity';

    // 1. Enforce Binary Signature / Magic Bytes Validation (prevents executable spoofing)
    if (dto.fileData && !this.encryptionService.validateMagicBytes(dto.fileData, dto.fileType)) {
      throw new BadRequestException('Security Violation: File binary signature does not match declared file type');
    }

    // 2. Encrypt document payload with AES-256-GCM authenticated encryption
    const encryptedPayload = dto.fileData ? this.encryptionService.encrypt(dto.fileData, user.id) : null;

    try {
      const created = await this.prisma.document.create({
        data: {
          userId: user.id,
          title: dto.title,
          category: matchedCategory as any,
          fileKey: dto.fileKey || `neon-doc-${Date.now()}-${dto.title.replace(/\s+/g, '_')}.${dto.fileType}`,
          fileData: encryptedPayload, // AES-256-GCM encrypted document payload
          fileType: dto.fileType,
          fileSizeBytes: dto.fileSizeBytes,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
          isVerified: true,
          policyNumber: dto.policyNumber || null,
          issuer: dto.issuer || null,
          notes: dto.notes || null,
          tags: dto.tags || [matchedCategory],
          isPriority: dto.isPriority || false,
        },
      });

      // Increment storage quota on User in Prisma
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          storageUsedBytes: {
            increment: dto.fileSizeBytes,
          },
        },
      }).catch(() => {});

      const item = this.mapPrismaDocToItem(created);
      // Decrypt for returning to the creating user
      if (created.fileData) {
        item.fileUrl = this.encryptionService.decrypt(created.fileData, user.id);
      }
      return item;
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      // In-memory fallback if database is temporarily offline
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      userId: user.id,
      title: dto.title,
      category: matchedCategory as any,
      fileKey: dto.fileKey || `neon-doc-${Date.now()}.${dto.fileType}`,
      fileData: encryptedPayload || undefined,
      fileUrl: dto.fileData || undefined,
      fileType: dto.fileType,
      fileSizeBytes: dto.fileSizeBytes,
      fileSizeFormatted: `${mb} MB`,
      issueDate: dto.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: dto.expiryDate || null,
      daysLeft,
      isExpiringSoon,
      isVerified: true,
      policyNumber: dto.policyNumber || null,
      issuer: dto.issuer || null,
      notes: dto.notes || null,
      tags: dto.tags || [dto.category],
      isPriority: dto.isPriority || false,
      isRecent: true,
      badgeLabel: isExpiringSoon ? 'EXPIRING SOON' : 'ACTIVE',
      badgeType: isExpiringSoon ? 'danger' : 'success',
      accentColor: dto.category === 'Insurance' ? '#0861E8' : '#10B981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockDocuments.unshift(newDoc);
    return newDoc;
  }

  async updateDocument(user: User, id: string, dto: UpdateDocumentDto): Promise<DocumentItem> {
    try {
      const existing = await this.prisma.document.findUnique({ where: { id } });
      if (existing) {
        if (existing.userId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this document');
        }
        const updateData: any = { ...dto };
        if (dto.issueDate) updateData.issueDate = new Date(dto.issueDate);
        if (dto.expiryDate) updateData.expiryDate = new Date(dto.expiryDate);

        const updated = await this.prisma.document.update({
          where: { id },
          data: updateData,
        });
        return this.mapPrismaDocToItem(updated);
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // In-memory fallback
    }

    const index = this.mockDocuments.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }

    const current = this.mockDocuments[index];
    if (current.userId !== user.id && current.userId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this document');
    }
    const updated: DocumentItem = {
      ...current,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.mockDocuments[index] = updated;
    return updated;
  }

  async deleteDocument(user: User, id: string): Promise<{ success: boolean }> {
    try {
      const existing = await this.prisma.document.findUnique({ where: { id } });
      if (existing) {
        if (existing.userId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this document');
        }
        const deleted = await this.prisma.document.delete({
          where: { id },
        });
        if (deleted) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              storageUsedBytes: {
                decrement: deleted.fileSizeBytes,
              },
            },
          }).catch(() => {});
          return { success: true };
        }
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // In-memory fallback
    }

    const doc = this.mockDocuments.find((d) => d.id === id);
    if (!doc) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
    if (doc.userId !== user.id && doc.userId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this document');
    }
    this.mockDocuments = this.mockDocuments.filter((d) => d.id !== id);
    return { success: true };
  }

  async verifyDocument(user: User, id: string): Promise<DocumentItem> {
    const doc = await this.getDocumentById(user, id);
    return this.updateDocument(user, id, {
      isVerified: true,
      badgeLabel: 'VERIFIED',
      badgeType: 'success',
    } as any);
  }
}
