import { PaperTrailApiClient } from '@papertrail/api-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = new PaperTrailApiClient({
  baseUrl: API_BASE_URL,
  onError: (error) => {
    // Log API errors without breaking user experience
    console.warn('[PaperTrail API Warning]', error.message);
  },
});

export const setApiAuthTokenGetter = (getter: () => Promise<string | null>) => {
  apiClient.setTokenGetter(getter);
};
