import React, { useEffect } from 'react';
import { DocumentProvider, useDocumentContext } from './context/DocumentContext';
import { ClerkAuthProvider } from './auth/ClerkAuthProvider';
import { BentoLayout } from './components/bento/BentoLayout';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { BentoHomeScreen } from './screens/BentoHomeScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { DocumentDetailScreen } from './screens/DocumentDetailScreen';
import { UploadScreen } from './screens/UploadScreen';
import { ScanScreen } from './screens/ScanScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { FoldersScreen } from './screens/FoldersScreen';
import { SharedDocumentsScreen } from './screens/SharedDocumentsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StorageScreen } from './screens/StorageScreen';
import { HelpScreen } from './screens/HelpScreen';
import { DocumentActionSheet } from './components/DocumentActionSheet';
import { DocumentModal } from './components/DocumentModal';
import { UploadModal } from './components/UploadModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AssistantModal } from './components/AssistantModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { initNativeServices, isNative } from './services/nativeService';

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
        {renderActiveScreen()}
      </BentoLayout>

      {/* Global Interactive Modals & Command Palette */}
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
