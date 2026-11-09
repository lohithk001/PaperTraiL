import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  DocumentItem, 
  ReminderItem, 
  NotificationItem, 
  UserProfile, 
  TabScreen, 
  FilterType,
  FolderItem,
  SharedDocumentItem,
  DocumentCategory,
  ReminderPreferences
} from '../types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_REMINDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER_PROFILE,
  INITIAL_FOLDERS,
  INITIAL_SHARED_DOCUMENTS
} from '../data/mockData';
import { apiClient } from '../services/apiService';
import { isNative } from '../services/nativeService';

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function parseFileSizeToBytes(sizeStr?: string): number {
  if (!sizeStr) return 0;
  const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB|GB)?/i);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = (match[2] || 'MB').toUpperCase();
  if (unit === 'GB') return val * 1024 * 1024 * 1024;
  if (unit === 'MB') return val * 1024 * 1024;
  if (unit === 'KB') return val * 1024;
  return val;
}

export interface StorageCategoryBreakdown {
  category: DocumentCategory;
  bytes: number;
  sizeFormatted: string;
  count: number;
  percent: number;
  color: string;
}

export interface StorageStats {
  totalBytes: number;
  totalMb: number;
  quotaBytes: number;
  quotaMb: number;
  usedFormatted: string;
  quotaFormatted: string;
  percentUsed: number;
  remainingBytes: number;
  remainingMb: number;
  remainingFormatted: string;
  categoryBreakdown: StorageCategoryBreakdown[];
}

interface DocumentContextType {
  documents: DocumentItem[];
  reminders: ReminderItem[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
  folders: FolderItem[];
  sharedDocuments: SharedDocumentItem[];
  storageStats: StorageStats;
  activeTab: TabScreen;
  setActiveTab: (tab: TabScreen) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  selectedDocument: DocumentItem | null;
  setSelectedDocument: (doc: DocumentItem | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isActionSheetOpen: boolean;
  setIsActionSheetOpen: (open: boolean) => void;
  sharedInboundFile: { uri: string; mimeType: string } | null;
  setSharedInboundFile: (file: { uri: string; mimeType: string } | null) => void;
  activeDocumentDetail: DocumentItem | null;
  setActiveDocumentDetail: (doc: DocumentItem | null) => void;
  deviceViewMode: 'mobile' | 'responsive';
  setDeviceViewMode: (mode: 'mobile' | 'responsive') => void;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => DocumentItem;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  toggleFavorite: (id: string) => void;
  markDocumentVerified: (id: string) => void;
  createFolder: (name: string, category: DocumentCategory) => void;
  deleteFolder: (id: string) => void;
  createShare: (docId: string, recipientName: string, recipientEmail: string, permission: 'view' | 'download' | 'edit', expiresAt: string) => void;
  revokeShare: (id: string) => void;
  addReminder: (rem: Omit<ReminderItem, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  saveOnboardingStep: (step: number) => Promise<void>;
  saveOnboardingCategories: (categories: string[]) => Promise<void>;
  saveOnboardingPreferences: (prefs: ReminderPreferences) => Promise<void>;
  saveOnboardingProfile: (data: { name: string; avatarUrl?: string; preferredLanguage?: string }) => Promise<void>;
  completeOnboardingJourney: () => Promise<void>;
  filteredDocuments: DocumentItem[];
  heroDocument: DocumentItem | null;
  stackedDocuments: DocumentItem[];
  counts: {
    all: number;
    recent: number;
    expiring: number;
  };
  unreadNotificationsCount: number;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DOCUMENTS: 'papertrail_vault_documents_v2',
  REMINDERS: 'papertrail_vault_reminders_v2',
  NOTIFICATIONS: 'papertrail_vault_notifications_v2',
  PROFILE: 'papertrail_vault_profile_v2',
  DEVICE_MODE: 'papertrail_device_mode_v1',
  FOLDERS: 'papertrail_vault_folders_v2',
  SHARED: 'papertrail_vault_shared_v2',
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load real documents from localStorage (strictly clean of any legacy mock data)
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || localStorage.getItem('papertrail_documents_v1');
      if (!saved) return [];
      const parsed: DocumentItem[] = JSON.parse(saved);
      // Strip any simulated or fake document fixtures
      return parsed.filter(d => 
        !d.id.startsWith('doc-hero') && 
        !d.id.startsWith('doc-id-') && 
        !d.id.startsWith('doc-edu-') && 
        !d.id.startsWith('doc-fin-') && 
        !d.id.startsWith('doc-ins-') && 
        !d.id.startsWith('doc-med-') && 
        !d.id.startsWith('doc-war-')
      );
    } catch {
      return [];
    }
  });

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    } catch {
      return INITIAL_FOLDERS;
    }
  });

  const [sharedDocuments, setSharedDocuments] = useState<SharedDocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHARED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? { ...INITIAL_USER_PROFILE, ...JSON.parse(saved) } : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [activeTab, setActiveTab] = useState<TabScreen>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.onboardingCompleted) {
          return 'home';
        }
      }
      const isMobile = isNative || (typeof window !== 'undefined' && window.innerWidth < 768);
      return isMobile ? 'auth' : 'landing';
    } catch {
      return isNative ? 'auth' : 'landing';
    }
  });
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [sharedInboundFile, setSharedInboundFile] = useState<{ uri: string; mimeType: string } | null>(null);
  const [activeDocumentDetail, setActiveDocumentDetail] = useState<DocumentItem | null>(null);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen]);

  useEffect(() => {
    const handleShared = (e: any) => {
      if (e.detail) {
        setSharedInboundFile(e.detail);
        setActiveTab('upload');
      }
    };
    window.addEventListener('papertrail:shared-file', handleShared);
    return () => window.removeEventListener('papertrail:shared-file', handleShared);
  }, []);
  
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'responsive'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVICE_MODE);
      return (saved as 'mobile' | 'responsive') || 'responsive';
    } catch {
      return 'responsive';
    }
  });

  // Automatically synchronize documents and reminders from backend database
  useEffect(() => {
    apiClient.listDocuments()
      .then(res => {
        if (res && res.documents && res.documents.length > 0) {
          setDocuments(res.documents as unknown as DocumentItem[]);
        }
      })
      .catch(() => {
        // Keep local storage cache if offline
      });

    apiClient.listReminders()
      .then(res => {
        if (res && res.length > 0) {
          setReminders(res);
        }
      })
      .catch(() => {
        // Keep local storage cache if offline
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHARED, JSON.stringify(sharedDocuments));
  }, [sharedDocuments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICE_MODE, deviceViewMode);
  }, [deviceViewMode]);

  // Dynamic Storage Calculation derived strictly from real uploaded documents
  const storageStats = useMemo<StorageStats>(() => {
    let totalBytes = 0;
    const catMap: Record<string, { bytes: number; count: number; color: string }> = {
      'Identity': { bytes: 0, count: 0, color: '#1D5FF0' },
      'Insurance': { bytes: 0, count: 0, color: '#10B981' },
      'Finance': { bytes: 0, count: 0, color: '#F59E0B' },
      'Education': { bytes: 0, count: 0, color: '#8B5CF6' },
      'Medical': { bytes: 0, count: 0, color: '#EC4899' },
      'Warranty': { bytes: 0, count: 0, color: '#6366F1' },
      'Vehicle': { bytes: 0, count: 0, color: '#06B6D4' },
    };

    documents.forEach((d) => {
      const bytes = d.fileSizeBytes || parseFileSizeToBytes(d.fileSize);
      totalBytes += bytes;
      const catKey = catMap[d.category] ? d.category : 'Identity';
      catMap[catKey].bytes += bytes;
      catMap[catKey].count += 1;
    });

    const quotaBytes = 500 * 1024 * 1024; // 500 MB Free Tier Quota
    const quotaMb = 500;
    const totalMb = totalBytes / (1024 * 1024);
    const percentUsed = totalBytes > 0 ? Number(((totalBytes / quotaBytes) * 100).toFixed(2)) : 0;
    const remainingBytes = Math.max(0, quotaBytes - totalBytes);
    const remainingMb = Math.max(0, quotaMb - totalMb);

    const categoryBreakdown: StorageCategoryBreakdown[] = Object.entries(catMap)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        category: name as DocumentCategory,
        bytes: data.bytes,
        sizeFormatted: formatBytes(data.bytes),
        count: data.count,
        percent: totalBytes > 0 ? Math.round((data.bytes / totalBytes) * 100) : 0,
        color: data.color,
      }));

    return {
      totalBytes,
      totalMb,
      quotaBytes,
      quotaMb,
      usedFormatted: formatBytes(totalBytes),
      quotaFormatted: '500 MB',
      percentUsed,
      remainingBytes,
      remainingMb,
      remainingFormatted: formatBytes(remainingBytes),
      categoryBreakdown,
    };
  }, [documents]);

  // Synchronize profile stats automatically with actual vault documents & storage
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      documentsCount: documents.length,
      storageUsed: storageStats.usedFormatted,
      storageTotal: storageStats.quotaFormatted,
      storageUsedPercent: storageStats.percentUsed,
    }));
  }, [documents.length, storageStats]);

  // Document Counts
  const counts = useMemo(() => {
    return {
      all: documents.length,
      recent: documents.filter(d => d.isRecent).length,
      expiring: documents.filter(d => d.isExpiringSoon).length,
    };
  }, [documents]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Filtering documents based on filter chips, search query, and category
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filter tab condition
      if (filter === 'recent' && !doc.isRecent) return false;
      if (filter === 'expiring' && !doc.isExpiringSoon) return false;

      // Category filter condition
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;

      // Search query condition
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesCategory = doc.category.toLowerCase().includes(query);
        const matchesIssuer = doc.issuer?.toLowerCase().includes(query);
        const matchesTags = doc.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCategory && !matchesIssuer && !matchesTags) return false;
      }

      return true;
    });
  }, [documents, filter, selectedCategory, searchQuery]);

  // Primary Hero Card Document (the focal point from the reference)
  // Defaults to Vehicle Insurance Policy or first expiring/priority document
  const heroDocument = useMemo(() => {
    const list = filteredDocuments.length > 0 ? filteredDocuments : documents;
    const foundPriority = list.find(d => d.isPriority && d.isExpiringSoon);
    return foundPriority || list[0] || null;
  }, [filteredDocuments, documents]);

  // Stacked documents behind the hero card
  const stackedDocuments = useMemo(() => {
    if (!heroDocument) return [];
    return documents.filter(d => d.id !== heroDocument.id).slice(0, 3);
  }, [documents, heroDocument]);

  // CRUD actions
  const addDocument = (docData: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    setDocuments(prev => [newDoc, ...prev]);
    setUserProfile(prev => ({ ...prev, documentsCount: prev.documentsCount + 1 }));

    // Automatically generate lifecycle reminder if an expiry date is specified
    if (newDoc.expiryDate) {
      const diffMs = new Date(newDoc.expiryDate).getTime() - Date.now();
      const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const newReminder: ReminderItem = {
        id: `rem-${Date.now()}`,
        documentId: newDoc.id,
        documentTitle: newDoc.title,
        title: `${newDoc.title} Expiration`,
        dueDate: newDoc.expiryDate,
        daysLeft: diffDays,
        urgency: diffDays <= 15 ? 'critical' : diffDays <= 45 ? 'warning' : 'normal',
        isCompleted: false,
        category: newDoc.category,
      };
      setReminders(prev => [newReminder, ...prev]);
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Document Added',
      message: `"${newDoc.title}" has been saved to your vault.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'success',
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Asynchronously synchronize with backend API & Neon Database
    apiClient.createDocument({
      title: newDoc.title,
      category: newDoc.category,
      fileKey: newDoc.fileName ? `users/docs/${newDoc.fileName}` : `users/docs/${newDoc.id}.${newDoc.fileType}`,
      fileData: newDoc.fileUrl || undefined, // Stored directly in Neon PostgreSQL
      fileType: (newDoc.fileType as any) || 'pdf',
      fileSizeBytes: newDoc.fileSizeBytes || parseFileSizeToBytes(newDoc.fileSize),
      issueDate: newDoc.issueDate,
      expiryDate: newDoc.expiryDate || undefined,
      policyNumber: newDoc.policyNumber,
      issuer: newDoc.issuer,
      notes: newDoc.notes,
      tags: newDoc.tags,
      isPriority: Boolean(newDoc.isPriority),
    }).catch(err => {
      console.warn('Backend document sync deferred (cached locally):', err);
    });

    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteDocument = (id: string) => {
    const docToDelete = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    setReminders(prev => prev.filter(r => r.documentId !== id));
    setUserProfile(prev => ({ ...prev, documentsCount: Math.max(0, prev.documentsCount - 1) }));
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument(null);
    }
    apiClient.deleteDocument(id).catch(err => {
      console.warn('Backend document delete deferred:', err);
    });
    if (docToDelete) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Document Removed',
        message: `"${docToDelete.title}" has been deleted from your vault.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'info',
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const toggleFavorite = (id: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
    if (activeDocumentDetail && activeDocumentDetail.id === id) {
      setActiveDocumentDetail(prev => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const createFolder = (name: string, category: DocumentCategory) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      category,
      documentCount: 0,
      totalSize: '0 MB',
      color: 'text-[#1D5FF0]',
      iconBg: 'bg-[#EAF1FF]',
      updatedAt: 'Just now',
    };
    setFolders(prev => [newFolder, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Folder Created',
      message: `Folder "${name}" was created successfully.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'success',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const deleteFolder = (id: string) => {
    const target = folders.find(f => f.id === id);
    setFolders(prev => prev.filter(f => f.id !== id));
    if (target) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Folder Deleted',
        message: `Folder "${target.name}" has been deleted.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'info',
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const createShare = (
    docId: string, 
    recipientName: string, 
    recipientEmail: string, 
    permission: 'view' | 'download' | 'edit', 
    expiresAt: string
  ) => {
    const doc = documents.find(d => d.id === docId);
    const tempId = `share-${Date.now()}`;
    const newShare: SharedDocumentItem = {
      id: tempId,
      documentId: docId,
      documentTitle: doc ? doc.title : 'Document',
      fileType: doc ? doc.fileType : 'pdf',
      fileSize: doc ? doc.fileSize : '2.0 MB',
      category: doc ? doc.category : 'Identity',
      recipientName,
      recipientEmail,
      sharedDate: new Date().toISOString().split('T')[0],
      permission,
      expiresAt,
      accessCount: 0,
      status: 'active',
    };
    setSharedDocuments(prev => [newShare, ...prev]);

    // Persist to Neon DB
    if (docId) {
      const hours = Math.max(1, Math.round((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)));
      apiClient.createShareLink(docId, hours)
        .then(tokenRes => {
          if (tokenRes && tokenRes.token) {
            setSharedDocuments(prev => prev.map(s => s.id === tempId ? { ...s, id: tokenRes.token } : s));
          }
        })
        .catch(e => {
          console.warn('[PaperTrail] Could not persist share token to backend:', e);
        });
    }

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Document Shared',
      message: `Shared "${newShare.documentTitle}" with ${recipientName}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'success',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const revokeShare = (id: string) => {
    setSharedDocuments(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'revoked' as const } : s))
    );
    apiClient.revokeShareLink(id).catch(e => {
      console.warn('[PaperTrail] Could not revoke share token on backend:', e);
    });
    const target = sharedDocuments.find(s => s.id === id);
    if (target) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Share Access Revoked',
        message: `Access to "${target.documentTitle}" was revoked for ${target.recipientName}.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'info',
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const markDocumentVerified = (id: string) => {
    updateDocument(id, { isVerified: true, badgeLabel: 'VERIFIED', badgeType: 'success' });
    const doc = documents.find(d => d.id === id);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Document Verified',
      message: `"${doc ? doc.title : 'Document'}" marked verified & authentic.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'success',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addReminder = (remData: Omit<ReminderItem, 'id'>) => {
    const tempId = `rem-${Date.now()}`;
    const newRem: ReminderItem = {
      ...remData,
      id: tempId,
    };
    setReminders(prev => [newRem, ...prev]);

    // Persist to Neon DB if documentId exists
    if (remData.documentId && remData.documentId !== 'custom') {
      apiClient.createReminder({
        documentId: remData.documentId,
        title: remData.title,
        dueDate: remData.dueDate,
      })
      .then(persisted => {
        if (persisted && persisted.id) {
          setReminders(prev => prev.map(r => r.id === tempId ? persisted : r));
        }
      })
      .catch(e => {
        console.warn('[PaperTrail] Could not persist reminder to database:', e);
      });
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
    apiClient.toggleReminder(id).catch(e => {
      console.warn('[PaperTrail] Could not toggle reminder on database:', e);
    });
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    apiClient.deleteReminder(id).catch(e => {
      console.warn('[PaperTrail] Could not delete reminder on database:', e);
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const saveOnboardingStep = async (step: number) => {
    setUserProfile(prev => ({ ...prev, onboardingStep: step }));
    try {
      await apiClient.updateOnboardingState({ step });
    } catch (e) {
      console.warn('[PaperTrail] Could not persist onboarding step to backend:', e);
    }
  };

  const saveOnboardingCategories = async (categories: string[]) => {
    setUserProfile(prev => ({ ...prev, selectedDocumentCategories: categories }));
    try {
      await apiClient.updateOnboardingState({ selectedCategories: categories });
    } catch (e) {
      console.warn('[PaperTrail] Could not persist categories to backend:', e);
    }
  };

  const saveOnboardingPreferences = async (prefs: ReminderPreferences) => {
    setUserProfile(prev => ({ ...prev, reminderPreferences: prefs }));
    try {
      await apiClient.updateOnboardingState({ reminderPreferences: prefs });
    } catch (e) {
      console.warn('[PaperTrail] Could not persist reminder preferences to backend:', e);
    }
  };

  const saveOnboardingProfile = async (data: { name: string; avatarUrl?: string; preferredLanguage?: string }) => {
    setUserProfile(prev => ({
      ...prev,
      name: data.name,
      avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : prev.avatarUrl,
      preferredLanguage: data.preferredLanguage !== undefined ? data.preferredLanguage : prev.preferredLanguage,
    }));
    try {
      await apiClient.updateOnboardingState({
        displayName: data.name,
        avatarUrl: data.avatarUrl,
        preferredLanguage: data.preferredLanguage,
      });
    } catch (e) {
      console.warn('[PaperTrail] Could not persist profile to backend:', e);
    }
  };

  const completeOnboardingJourney = async () => {
    setUserProfile(prev => ({
      ...prev,
      onboardingCompleted: true,
      onboardingStep: 6,
    }));
    try {
      await apiClient.completeOnboarding();
    } catch (e) {
      console.warn('[PaperTrail] Could not mark onboarding completed in backend:', e);
    }
    setActiveTab('home');
  };

  // Derive folder counts and sizes dynamically from real documents in the vault
  const dynamicFolders = useMemo<FolderItem[]>(() => {
    return folders.map(f => {
      const docsInCat = documents.filter(d => d.category === f.category);
      const catBytes = docsInCat.reduce((acc, d) => acc + (d.fileSizeBytes || parseFileSizeToBytes(d.fileSize)), 0);
      return {
        ...f,
        documentCount: docsInCat.length,
        totalSize: formatBytes(catBytes),
      };
    });
  }, [folders, documents]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        reminders,
        notifications,
        userProfile,
        folders: dynamicFolders,
        sharedDocuments,
        storageStats,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        selectedDocument,
        setSelectedDocument,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isActionSheetOpen,
        setIsActionSheetOpen,
        sharedInboundFile,
        setSharedInboundFile,
        activeDocumentDetail,
        setActiveDocumentDetail,
        deviceViewMode,
        setDeviceViewMode,
        addDocument,
        updateDocument,
        deleteDocument,
        toggleFavorite,
        markDocumentVerified,
        createFolder,
        deleteFolder,
        createShare,
        revokeShare,
        addReminder,
        toggleReminder,
        deleteReminder,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
        saveOnboardingStep,
        saveOnboardingCategories,
        saveOnboardingPreferences,
        saveOnboardingProfile,
        completeOnboardingJourney,
        filteredDocuments,
        heroDocument,
        stackedDocuments,
        counts,
        unreadNotificationsCount,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};
