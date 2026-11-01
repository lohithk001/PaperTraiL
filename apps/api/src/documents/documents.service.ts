import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { DocumentItem, User } from '@papertrail/types';
import { CreateDocumentDto, UpdateDocumentDto } from '@papertrail/contracts';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
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
    let result = [...this.mockDocuments];

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
    const doc = this.mockDocuments.find((d) => d.id === id);
    if (!doc) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
    const signedUrl = await this.storageService.getPresignedDownloadUrl(doc.fileKey);
    return {
      ...doc,
      fileUrl: signedUrl,
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

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      userId: user.id,
      title: dto.title,
      category: dto.category,
      fileKey: dto.fileKey,
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
    const index = this.mockDocuments.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }

    const current = this.mockDocuments[index];
    const updated: DocumentItem = {
      ...current,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.mockDocuments[index] = updated;
    return updated;
  }

  async deleteDocument(user: User, id: string): Promise<{ success: boolean }> {
    const initialLen = this.mockDocuments.length;
    this.mockDocuments = this.mockDocuments.filter((d) => d.id !== id);
    if (this.mockDocuments.length === initialLen) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }
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
