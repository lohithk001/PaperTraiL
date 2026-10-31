import React from 'react';
import { DocumentProvider, useDocumentContext } from './context/DocumentContext';
import { DeviceFrame } from './components/DeviceFrame';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { ScanScreen } from './screens/ScanScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DocumentModal } from './components/DocumentModal';
import { UploadModal } from './components/UploadModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AssistantModal } from './components/AssistantModal';

const AppContent: React.FC = () => {
  const { activeTab } = useDocumentContext();

  return (
    <DeviceFrame>
      {/* Screen Router */}
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'documents' && <DocumentsScreen />}
      {activeTab === 'scan' && <ScanScreen />}
      {activeTab === 'reminders' && <RemindersScreen />}
      {activeTab === 'settings' && <SettingsScreen />}

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Interactive Modals */}
      <DocumentModal />
      <UploadModal />
      <NotificationsModal />
      <AssistantModal />
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <DocumentProvider>
      <AppContent />
    </DocumentProvider>
  );
}
