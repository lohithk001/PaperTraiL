import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  DocumentItem, 
  ReminderItem, 
  NotificationItem, 
  UserProfile, 
  TabScreen, 
  FilterType 
} from '../types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_REMINDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER_PROFILE 
} from '../data/mockData';

interface DocumentContextType {
  documents: DocumentItem[];
  reminders: ReminderItem[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  deviceViewMode: 'mobile' | 'responsive';
  setDeviceViewMode: (mode: 'mobile' | 'responsive') => void;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => DocumentItem;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  markDocumentVerified: (id: string) => void;
  addReminder: (rem: Omit<ReminderItem, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
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
  DOCUMENTS: 'papertrail_documents_v1',
  REMINDERS: 'papertrail_reminders_v1',
  NOTIFICATIONS: 'papertrail_notifications_v1',
  PROFILE: 'papertrail_profile_v1',
  DEVICE_MODE: 'papertrail_device_mode_v1',
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or use initial mock data
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'responsive'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVICE_MODE);
      return (saved as 'mobile' | 'responsive') || 'mobile';
    } catch {
      return 'mobile';
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

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
    const newRem: ReminderItem = {
      ...remData,
      id: `rem-${Date.now()}`,
    };
    setReminders(prev => [newRem, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
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

  return (
    <DocumentContext.Provider
      value={{
        documents,
        reminders,
        notifications,
        userProfile,
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
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        deviceViewMode,
        setDeviceViewMode,
        addDocument,
        updateDocument,
        deleteDocument,
        markDocumentVerified,
        addReminder,
        toggleReminder,
        deleteReminder,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
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
