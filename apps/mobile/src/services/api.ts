import { PaperTrailApiClient } from '@papertrail/api-client';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = new PaperTrailApiClient({
  baseUrl: API_BASE_URL,
  getToken: async () => {
    try {
      return await SecureStore.getItemAsync('clerk_session_token');
    } catch {
      return null;
    }
  },
  onError: (err) => {
    console.warn('[Mobile API Error]:', err.message);
  },
});
