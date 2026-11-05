import { 
  DocumentItem, 
  ReminderItem, 
  NotificationItem, 
  FolderItem, 
  StorageInfo, 
  User, 
  ShareTokenItem 
} from '@papertrail/types';
import { 
  API_ROUTES, 
  ApiResponse, 
  CreateDocumentDto, 
  UpdateDocumentDto, 
  CreateReminderDto, 
  CreateFolderDto, 
  PresignedUploadResponse,
  UpdateOnboardingDto
} from '@papertrail/contracts';

export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
  onError?: (error: Error) => void;
}

export class PaperTrailApiClient {
  private baseUrl: string;
  private getToken?: () => Promise<string | null>;
  private onError?: (error: Error) => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getToken = config.getToken;
    this.onError = config.onError;
  }

  setTokenGetter(getToken: () => Promise<string | null>) {
    this.getToken = getToken;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.getToken) {
      try {
        const token = await this.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Failed to retrieve auth token:', e);
      }
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errMessage = `HTTP Error ${response.status}`;
        try {
          const errBody = await response.json();
          errMessage = errBody.message || errBody.error || errMessage;
        } catch {}
        const error = new Error(errMessage);
        this.onError?.(error);
        throw error;
      }

      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      this.onError?.(err);
      throw err;
    }
  }

  // --- Auth & User & Onboarding ---
  async getCurrentUser(): Promise<User> {
    return this.request<User>(API_ROUTES.AUTH.ME);
  }

  async updateOnboardingState(dto: UpdateOnboardingDto): Promise<User> {
    return this.request<User>(API_ROUTES.AUTH.ONBOARDING, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  async completeOnboarding(): Promise<User> {
    return this.request<User>(API_ROUTES.AUTH.ONBOARDING_COMPLETE, {
      method: 'POST',
    });
  }

  // --- Storage & Uploads ---
  async getPresignedUploadUrl(params: {
    filename: string;
    fileType: 'pdf' | 'png' | 'jpg' | 'jpeg';
    fileSizeBytes: number;
  }): Promise<PresignedUploadResponse> {
    return this.request<PresignedUploadResponse>(API_ROUTES.STORAGE.PRESIGNED_UPLOAD, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async uploadFileToR2(uploadUrl: string, file: Blob | File): Promise<void> {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    if (!res.ok) {
      throw new Error(`Cloudflare R2 Direct Upload Failed: ${res.statusText}`);
    }
  }

  async getStorageInfo(): Promise<StorageInfo> {
    return this.request<StorageInfo>(API_ROUTES.STORAGE.INFO);
  }

  // --- Documents ---
  async listDocuments(params?: {
    search?: string;
    category?: string;
    filter?: 'all' | 'recent' | 'expiring';
    sortBy?: 'date' | 'expiry' | 'title';
    page?: number;
    limit?: number;
  }): Promise<{ documents: DocumentItem[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
    if (params?.filter) searchParams.set('filter', params.filter);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const endpoint = `${API_ROUTES.DOCUMENTS.BASE}?${searchParams.toString()}`;
    return this.request<{ documents: DocumentItem[]; total: number }>(endpoint);
  }

  async getDocument(id: string): Promise<DocumentItem> {
    return this.request<DocumentItem>(API_ROUTES.DOCUMENTS.BY_ID(id));
  }

  async createDocument(dto: CreateDocumentDto): Promise<DocumentItem> {
    return this.request<DocumentItem>(API_ROUTES.DOCUMENTS.BASE, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async updateDocument(id: string, dto: UpdateDocumentDto): Promise<DocumentItem> {
    return this.request<DocumentItem>(API_ROUTES.DOCUMENTS.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(API_ROUTES.DOCUMENTS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  async verifyDocument(id: string): Promise<DocumentItem> {
    return this.request<DocumentItem>(API_ROUTES.DOCUMENTS.VERIFY(id), {
      method: 'POST',
    });
  }

  // --- Reminders ---
  async listReminders(): Promise<ReminderItem[]> {
    return this.request<ReminderItem[]>(API_ROUTES.REMINDERS.BASE);
  }

  async createReminder(dto: CreateReminderDto): Promise<ReminderItem> {
    return this.request<ReminderItem>(API_ROUTES.REMINDERS.BASE, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async toggleReminder(id: string): Promise<ReminderItem> {
    return this.request<ReminderItem>(API_ROUTES.REMINDERS.TOGGLE(id), {
      method: 'POST',
    });
  }

  async deleteReminder(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(API_ROUTES.REMINDERS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // --- Folders ---
  async listFolders(): Promise<FolderItem[]> {
    return this.request<FolderItem[]>(API_ROUTES.FOLDERS.BASE);
  }

  async createFolder(dto: CreateFolderDto): Promise<FolderItem> {
    return this.request<FolderItem>(API_ROUTES.FOLDERS.BASE, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  // --- Notifications ---
  async listNotifications(): Promise<NotificationItem[]> {
    return this.request<NotificationItem[]>(API_ROUTES.NOTIFICATIONS.BASE);
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request<void>(API_ROUTES.NOTIFICATIONS.MARK_READ(id), {
      method: 'POST',
    });
  }

  async markAllNotificationsRead(): Promise<void> {
    return this.request<void>(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ, {
      method: 'POST',
    });
  }

  // --- Sharing ---
  async createShareLink(documentId: string, expiresInHours = 48): Promise<ShareTokenItem> {
    return this.request<ShareTokenItem>(API_ROUTES.SHARING.CREATE, {
      method: 'POST',
      body: JSON.stringify({ documentId, expiresInHours }),
    });
  }

  // --- AI & OCR ---
  async extractDocumentMetadata(fileKey: string): Promise<{
    title: string;
    category: string;
    issuer?: string;
    expiryDate?: string;
    policyNumber?: string;
    ocrText?: string;
  }> {
    return this.request(API_ROUTES.OCR.EXTRACT, {
      method: 'POST',
      body: JSON.stringify({ fileKey }),
    });
  }
}
