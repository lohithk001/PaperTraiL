export type DocumentCategory =
  | 'Insurance'
  | 'Identity'
  | 'Vehicle'
  | 'Education'
  | 'Warranty'
  | 'Finance'
  | 'Medical';

export type UrgencyLevel = 'critical' | 'warning' | 'normal';

export type FileFormat = 'pdf' | 'png' | 'jpg' | 'jpeg';

export interface ReminderPreferences {
  documentExpiry: boolean;
  warrantyExpiry: boolean;
  insuranceRenewal: boolean;
  billPayment: boolean;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  fullName: string;
  tagline?: string;
  avatarUrl?: string;
  storageUsedBytes: number;
  storageQuotaBytes: number;
  encryptionEnabled: boolean;
  biometricEnabled: boolean;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  selectedDocumentCategories?: string[];
  reminderPreferences?: ReminderPreferences;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  folderId?: string | null;
  title: string;
  category: DocumentCategory;
  fileKey: string; // Cloudflare R2 object key
  fileUrl?: string; // Presigned view URL
  fileType: FileFormat;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  issueDate: string;
  expiryDate: string | null;
  daysLeft: number | null;
  isExpiringSoon: boolean;
  isVerified: boolean;
  policyNumber?: string | null;
  issuer?: string | null;
  notes?: string | null;
  tags: string[];
  thumbnailUrl?: string | null;
  ocrExtractedText?: string | null;
  isPriority: boolean;
  isRecent: boolean;
  badgeLabel?: string;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
  accentColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderItem {
  id: string;
  userId: string;
  name: string;
  color?: string;
  icon?: string;
  documentCount: number;
  createdAt: string;
}

export interface ReminderItem {
  id: string;
  userId: string;
  documentId: string;
  documentTitle: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  urgency: UrgencyLevel;
  isCompleted: boolean;
  category: DocumentCategory;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info';
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ShareTokenItem {
  id: string;
  token: string;
  documentId: string;
  documentTitle: string;
  createdByUserId: string;
  expiresAt: string;
  accessCount: number;
  isRevoked: boolean;
}

export interface StorageInfo {
  usedBytes: number;
  quotaBytes: number;
  usedFormatted: string;
  quotaFormatted: string;
  percentageUsed: number;
  documentCount: number;
}

export type TabScreen = 'home' | 'documents' | 'scan' | 'reminders' | 'settings';
export type FilterType = 'all' | 'recent' | 'expiring';
