import { DocumentItem, ReminderItem, NotificationItem, UserProfile, SharedDocumentItem, FolderItem } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Vault Owner',
  tagline: 'Personal Document Vault',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  email: '',
  documentsCount: 0,
  storageUsed: '0 KB',
  storageTotal: '500 MB',
  storageUsedPercent: 0,
  encryptionEnabled: true,
  biometricEnabled: true,
  onboardingCompleted: false,
  onboardingStep: 1,
  selectedDocumentCategories: [],
  reminderPreferences: {
    documentExpiry: true,
    warrantyExpiry: true,
    insuranceRenewal: true,
    billPayment: true,
  },
  preferredLanguage: 'en',
};

// No made-up documents: vault starts completely clean and only contains user-uploaded documents
export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_REMINDERS: ReminderItem[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_FOLDERS: FolderItem[] = [
  {
    id: 'folder-identity',
    name: 'Personal Identity',
    category: 'Identity',
    documentCount: 0,
    totalSize: '0 KB',
    color: 'text-[#1D5FF0]',
    iconBg: 'bg-[#EAF1FF]',
    updatedAt: 'Recently',
  },
  {
    id: 'folder-education',
    name: 'Academic Credentials',
    category: 'Education',
    documentCount: 0,
    totalSize: '0 KB',
    color: 'text-[#8B5CF6]',
    iconBg: 'bg-[#F3E8FF]',
    updatedAt: 'Recently',
  },
  {
    id: 'folder-insurance',
    name: 'Policies & Cover',
    category: 'Insurance',
    documentCount: 0,
    totalSize: '0 KB',
    color: 'text-[#10B981]',
    iconBg: 'bg-[#ECFDF5]',
    updatedAt: 'Recently',
  },
  {
    id: 'folder-finance',
    name: 'Financial & Tax',
    category: 'Finance',
    documentCount: 0,
    totalSize: '0 KB',
    color: 'text-[#F59E0B]',
    iconBg: 'bg-[#FEF3C7]',
    updatedAt: 'Recently',
  },
];

export const INITIAL_SHARED_DOCUMENTS: SharedDocumentItem[] = [];
