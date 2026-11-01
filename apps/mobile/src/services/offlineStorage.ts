import * as SecureStore from 'expo-secure-store';
import { DocumentItem, ReminderItem } from '@papertrail/types';

const KEYS = {
  DOCUMENTS: 'papertrail_offline_documents',
  REMINDERS: 'papertrail_offline_reminders',
};

export const offlineStorage = {
  async saveDocuments(docs: DocumentItem[]): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.DOCUMENTS, JSON.stringify(docs));
    } catch (e) {
      console.warn('Failed to cache offline documents:', e);
    }
  },

  async getDocuments(): Promise<DocumentItem[] | null> {
    try {
      const data = await SecureStore.getItemAsync(KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveReminders(rems: ReminderItem[]): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.REMINDERS, JSON.stringify(rems));
    } catch (e) {
      console.warn('Failed to cache offline reminders:', e);
    }
  },

  async getReminders(): Promise<ReminderItem[] | null> {
    try {
      const data = await SecureStore.getItemAsync(KEYS.REMINDERS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
};
