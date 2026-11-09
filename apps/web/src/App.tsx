import React, { useEffect, Suspense, lazy } from 'react';
import { DocumentProvider, useDocumentContext } from './context/DocumentContext';
import { ClerkAuthProvider } from './auth/ClerkAuthProvider';
import { BentoLayout } from './components/bento/BentoLayout';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { BentoHomeScreen } from './screens/BentoHomeScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { DocumentActionSheet } from './components/DocumentActionSheet';
import { DocumentModal } from './components/DocumentModal';
import { UploadModal } from './components/UploadModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AssistantModal } from './components/AssistantModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ToastContainer } from './components/ui';
import { initNativeServices } from './services/nativeService';

// Lazy-loaded secondary screens for bundle size optimization & code splitting
const LandingScreen = lazy(() => import('./screens/LandingScreen').then(m => ({ default: m.LandingScreen })));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const DocumentDetailScreen = lazy(() => import('./screens/DocumentDetailScreen').then(m => ({ default: m.DocumentDetailScreen })));
const UploadScreen = lazy(() => import('./screens/UploadScreen').then(m => ({ default: m.UploadScreen })));
const ScanScreen = lazy(() => import('./screens/ScanScreen').then(m => ({ default: m.ScanScreen })));
const RemindersScreen = lazy(() => import('./screens/RemindersScreen').then(m => ({ default: m.RemindersScreen })));
const FoldersScreen = lazy(() => import('./screens/FoldersScreen').then(m => ({ default: m.FoldersScreen })));
const SharedDocumentsScreen = lazy(() => import('./screens/SharedDocumentsScreen').then(m => ({ default: m.SharedDocumentsScreen })));
const FavoritesScreen = lazy(() => import('./screens/FavoritesScreen').then(m => ({ default: m.FavoritesScreen })));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const StorageScreen = lazy(() => import('./screens/StorageScreen').then(m => ({ default: m.StorageScreen })));
const HelpScreen = lazy(() => import('./screens/HelpScreen').then(m => ({ default: m.HelpScreen })));

const ScreenLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
    <div className="w-10 h-10 border-3 border-[#1D5FF0]/20 border-t-[#1D5FF0] rounded-full animate-spin" />
    <span className="text-xs font-medium text-[#646860]">Loading vault interface...</span>
  </div>
);

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useDocumentContext();

  // Initialize Android Capacitor native device bindings
  useEffect(() => {
    initNativeServices(() => {
      // Android Back Button handler
      if (activeTab === 'document-detail' || activeTab === 'upload') {
        setActiveTab('documents');
      } else if (activeTab === 'scan' || activeTab === 'folders' || activeTab === 'reminders' || activeTab === 'settings' || activeTab === 'categories' || activeTab === 'shared' || activeTab === 'favorites') {
        setActiveTab('home');
      }
    });
  }, [activeTab, setActiveTab]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingScreen />;
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingScreen />;
      case 'auth':
        return <AuthScreen />;
      case 'home':
      case 'overview':
        return <BentoHomeScreen />;
      case 'documents':
        return <DocumentsScreen />;
      case 'document-detail':
        return <DocumentDetailScreen />;
      case 'upload':
        return <UploadScreen />;
      case 'scan':
        return <ScanScreen />;
      case 'reminders':
        return <RemindersScreen />;
      case 'folders':
      case 'categories':
        return <FoldersScreen />;
      case 'shared':
        return <SharedDocumentsScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'storage':
        return <StorageScreen />;
      case 'help':
        return <HelpScreen />;
      default:
        return <BentoHomeScreen />;
    }
  };

  return (
    <div className="min-h-screen text-[#111827]">
      
      {/* Universal Bento Canvas Layout (Desktop framed bento, Mobile full-bleed with Bento Bottom Nav) */}
      <BentoLayout>
        <Suspense fallback={<ScreenLoader />}>
          {renderActiveScreen()}
        </Suspense>
      </BentoLayout>

      {/* Global Interactive Modals & Command Palette */}
      <ToastContainer />
      <GlobalSearchModal />
      <DocumentActionSheet />
      <DocumentModal />
      <UploadModal />
      <NotificationsModal />
      <AssistantModal />

    </div>
  );
};

export default function App() {
  return (
    <DocumentProvider>
      <ClerkAuthProvider>
        <AppContent />
      </ClerkAuthProvider>
    </DocumentProvider>
  );
}
