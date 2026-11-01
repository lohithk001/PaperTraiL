export type DocumentCategory = 
  | 'Insurance' 
  | 'Identity' 
  | 'Vehicle' 
  | 'Education' 
  | 'Warranty' 
  | 'Finance' 
  | 'Medical';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  fileType: 'pdf' | 'png' | 'jpg';
  fileSize: string;
  issueDate: string;
  expiryDate: string | null;
  daysLeft: number | null;
  isExpiringSoon: boolean;
  isVerified: boolean;
  isFavorite?: boolean;
  policyNumber?: string;
  issuer?: string;
  notes?: string;
  thumbnailUrl?: string;
  tags: string[];
  isPriority?: boolean;
  isRecent?: boolean;
  badgeLabel?: string;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
  accentColor?: string;
  folderId?: string;
}

export interface ReminderItem {
  id: string;
  documentId: string;
  documentTitle: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  urgency: 'critical' | 'warning' | 'normal';
  isCompleted: boolean;
  category: DocumentCategory;
  schedule?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'alert' | 'success' | 'info';
}

export interface UserProfile {
  name: string;
  tagline: string;
  avatarUrl: string;
  email: string;
  documentsCount: number;
  storageUsed: string;
  storageTotal: string;
  storageUsedPercent: number;
  encryptionEnabled: boolean;
  biometricEnabled: boolean;
}

export interface SharedDocumentItem {
  id: string;
  documentId: string;
  documentTitle: string;
  fileType: 'pdf' | 'png' | 'jpg';
  fileSize: string;
  category: DocumentCategory;
  recipientName: string;
  recipientEmail: string;
  sharedDate: string;
  permission: 'view' | 'download' | 'edit';
  expiresAt: string;
  accessCount: number;
  status: 'active' | 'revoked' | 'expired';
}

export interface FolderItem {
  id: string;
  name: string;
  category: DocumentCategory;
  documentCount: number;
  totalSize: string;
  color: string;
  iconBg: string;
  updatedAt: string;
}

export type TabScreen = 
  | 'overview'
  | 'home'
  | 'documents' 
  | 'document-detail'
  | 'upload'
  | 'scan' 
  | 'reminders' 
  | 'folders'
  | 'categories'
  | 'shared'
  | 'favorites'
  | 'storage' 
  | 'settings'
  | 'help'
  | 'splash'
  | 'onboarding'
  | 'auth';

export type FilterType = 'all' | 'recent' | 'expiring';
