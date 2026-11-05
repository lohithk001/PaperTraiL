import { 
  DocumentItem, 
  FolderItem, 
  ReminderItem, 
  NotificationItem, 
  User, 
  StorageInfo, 
  ShareTokenItem 
} from '@papertrail/types';
import { z } from 'zod';
import { 
  CreateDocumentSchema, 
  UpdateDocumentSchema, 
  CreateReminderSchema, 
  CreateFolderSchema, 
  RequestPresignedUploadSchema,
  UpdateOnboardingStateSchema,
  OnboardingReminderPreferencesSchema
} from '@papertrail/validators';

export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof UpdateDocumentSchema>;
export type CreateReminderDto = z.infer<typeof CreateReminderSchema>;
export type CreateFolderDto = z.infer<typeof CreateFolderSchema>;
export type RequestPresignedUploadDto = z.infer<typeof RequestPresignedUploadSchema>;
export type UpdateOnboardingDto = z.infer<typeof UpdateOnboardingStateSchema>;
export type OnboardingReminderPreferencesDto = z.infer<typeof OnboardingReminderPreferencesSchema>;

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string;
  expiresAt: string;
  maxSizeBytes: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

export const API_ROUTES = {
  AUTH: {
    ME: '/api/v1/auth/me',
    SYNC_CLERK: '/api/v1/auth/sync',
    ONBOARDING: '/api/v1/auth/onboarding',
    ONBOARDING_COMPLETE: '/api/v1/auth/onboarding/complete',
  },
  DOCUMENTS: {
    BASE: '/api/v1/documents',
    BY_ID: (id: string) => `/api/v1/documents/${id}`,
    VERIFY: (id: string) => `/api/v1/documents/${id}/verify`,
    DOWNLOAD: (id: string) => `/api/v1/documents/${id}/download`,
  },
  STORAGE: {
    PRESIGNED_UPLOAD: '/api/v1/storage/upload-url',
    INFO: '/api/v1/storage/info',
  },
  REMINDERS: {
    BASE: '/api/v1/reminders',
    BY_ID: (id: string) => `/api/v1/reminders/${id}`,
    TOGGLE: (id: string) => `/api/v1/reminders/${id}/toggle`,
  },
  FOLDERS: {
    BASE: '/api/v1/folders',
    BY_ID: (id: string) => `/api/v1/folders/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/api/v1/notifications',
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/read-all',
  },
  SHARING: {
    CREATE: '/api/v1/share',
    RESOLVE: (token: string) => `/api/v1/share/${token}`,
    REVOKE: (token: string) => `/api/v1/share/${token}/revoke`,
  },
  OCR: {
    EXTRACT: '/api/v1/ocr/extract',
  },
} as const;
