import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { App as CapApp } from '@capacitor/app';
import { useDocumentContext } from '../context/DocumentContext';
import { isNative } from '../services/nativeService';
import { apiClient, setApiAuthTokenGetter } from '../services/apiService';

// Read Clerk publishable key from Vite environment
const RAW_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// A valid Clerk key starts with pk_test_ or pk_live_ and has at least 30 characters
export const isClerkConfigured = Boolean(
  RAW_PUBLISHABLE_KEY &&
  (RAW_PUBLISHABLE_KEY.startsWith('pk_test_') || RAW_PUBLISHABLE_KEY.startsWith('pk_live_')) &&
  !RAW_PUBLISHABLE_KEY.includes('placeholder')
);

// Fallback well-formed key used solely in local mock mode to ensure Clerk hooks initialize without throwing
const FALLBACK_PUBLISHABLE_KEY = 'pk_test_cGFwZXJ0cmFpbC5jbGVyay5hY2NvdW50cy5kZXYk';
const EFFECTIVE_PUBLISHABLE_KEY = isClerkConfigured ? RAW_PUBLISHABLE_KEY : FALLBACK_PUBLISHABLE_KEY;

interface VaultAuthContextValue {
  isClerkConfigured: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const VaultAuthContext = createContext<VaultAuthContextValue>({
  isClerkConfigured: false,
  isSignedIn: false,
  isLoaded: true,
  getToken: async () => null,
  signOut: async () => {},
});

export const useVaultAuth = () => useContext(VaultAuthContext);
export const useClerkConfigured = () => isClerkConfigured;

/**
 * Synchronizes authenticated Clerk session state with PaperTrail DocumentContext & Capacitor Android deep links
 */
const AuthBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, getToken, signOut: clerkSignOut } = useAuth();
  const { user } = useUser();
  const { updateUserProfile, userProfile, activeTab, setActiveTab } = useDocumentContext();

  // Provide live Clerk token getter to the API client
  useEffect(() => {
    if (isClerkConfigured && isSignedIn) {
      setApiAuthTokenGetter(async () => {
        try {
          return await getToken();
        } catch {
          return null;
        }
      });
    }
  }, [isSignedIn, getToken]);

  // 1. Synchronize Clerk User and Backend onboarding status into PaperTrail profile
  useEffect(() => {
    if (isClerkConfigured && isLoaded && isSignedIn && user) {
      const name = user.fullName || user.firstName || user.username || userProfile.name;
      const email = user.primaryEmailAddress?.emailAddress || userProfile.email;
      const avatarUrl = user.imageUrl || userProfile.avatarUrl;

      // Check backend for latest profile and onboarding state
      apiClient.getCurrentUser()
        .then((backendUser) => {
          updateUserProfile({
            name: backendUser.fullName || name,
            email: backendUser.email || email,
            avatarUrl: backendUser.avatarUrl || avatarUrl,
            onboardingCompleted: backendUser.onboardingCompleted ?? userProfile.onboardingCompleted,
            onboardingStep: backendUser.onboardingStep ?? userProfile.onboardingStep,
            selectedDocumentCategories: backendUser.selectedDocumentCategories ?? userProfile.selectedDocumentCategories,
            reminderPreferences: backendUser.reminderPreferences ?? userProfile.reminderPreferences,
            preferredLanguage: backendUser.preferredLanguage ?? userProfile.preferredLanguage,
          });
        })
        .catch(() => {
          // Graceful fallback when backend is temporarily offline
          updateUserProfile({
            name,
            email,
            avatarUrl,
          });
        });
    }
  }, [isLoaded, isSignedIn, user, updateUserProfile]);

  // 2. Authentication and Onboarding state router guard
  useEffect(() => {
    if (!isClerkConfigured || !isLoaded) return;

    if (isSignedIn) {
      // Transition from auth to appropriate screen on sign-in
      if (activeTab === 'auth') {
        if (userProfile.onboardingCompleted) {
          setActiveTab('home');
        } else {
          setActiveTab('onboarding');
        }
      }
    } else {
      // Transition to auth or onboarding when signed out
      if (activeTab !== 'auth' && activeTab !== 'splash' && activeTab !== 'onboarding') {
        setActiveTab('auth');
      }
    }
  }, [isLoaded, isSignedIn, activeTab, userProfile.onboardingCompleted, setActiveTab]);

  // 3. Android Capacitor OAuth deep link listener ('appUrlOpen')
  useEffect(() => {
    if (!isNative) return;

    let listenerHandle: any = null;
    CapApp.addListener('appUrlOpen', (event) => {
      try {
        const url = new URL(event.url);
        // Handle OAuth callback deep links: papertrail://sso-callback or /sso-callback
        if (url.pathname.includes('sso-callback') || url.host === 'sso-callback') {
          setActiveTab('auth');
        }
      } catch (err) {
        console.warn('Deep link parse error:', err);
      }
    }).then((handle) => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [setActiveTab]);

  const authValue = useMemo<VaultAuthContextValue>(() => ({
    isClerkConfigured,
    isSignedIn: Boolean(isSignedIn),
    isLoaded: Boolean(isLoaded),
    getToken: async () => {
      if (isClerkConfigured && isSignedIn) {
        return await getToken();
      }
      return null;
    },
    signOut: async () => {
      if (isClerkConfigured && clerkSignOut) {
        await clerkSignOut();
      }
      setActiveTab('auth');
    },
  }), [isSignedIn, isLoaded, getToken, clerkSignOut, setActiveTab]);

  return (
    <VaultAuthContext.Provider value={authValue}>
      {children}
    </VaultAuthContext.Provider>
  );
};

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={EFFECTIVE_PUBLISHABLE_KEY}>
      <AuthBridge>
        {children}
      </AuthBridge>
    </ClerkProvider>
  );
};
