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
  encryptionEnabled: boolean;
  biometricEnabled: boolean;
}

export type TabScreen = 'home' | 'documents' | 'scan' | 'reminders' | 'storage' | 'settings';
export type FilterType = 'all' | 'recent' | 'expiring';
