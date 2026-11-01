import React from 'react';
import { DocumentProvider, useDocumentContext } from './context/DocumentContext';
import { WebLayout } from './components/WebLayout';
import { HomeScreen } from './screens/HomeScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { ScanScreen } from './screens/ScanScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { StorageScreen } from './screens/StorageScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DocumentModal } from './components/DocumentModal';
import { UploadModal } from './components/UploadModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AssistantModal } from './components/AssistantModal';

const AppContent: React.FC = () => {
  const { activeTab } = useDocumentContext();

  return (
    <WebLayout>
      {/* Screen Router */}
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'documents' && <DocumentsScreen />}
      {activeTab === 'scan' && <ScanScreen />}
      {activeTab === 'reminders' && <RemindersScreen />}
      {activeTab === 'storage' && <StorageScreen />}
      {activeTab === 'settings' && <SettingsScreen />}

      {/* Global Interactive Modals */}
      <DocumentModal />
      <UploadModal />
      <NotificationsModal />
      <AssistantModal />
    </WebLayout>
  );
};

export default function App() {
  return (
    <DocumentProvider>
      <AppContent />
    </DocumentProvider>
  );
}
