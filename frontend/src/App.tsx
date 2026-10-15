import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { StarField } from './components/effects/StarField';
import { ScanlineOverlay } from './components/effects/ScanlineOverlay';
import { HudCornerAccents } from './components/effects/HudCornerAccents';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { AuthView } from './pages/AuthView';
import { DashboardView } from './pages/DashboardView';
import { CommsView } from './pages/CommsView';
import { AuditView } from './pages/AuditView';
import type { ViewTab } from './types';

const MainLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');

  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <div style={{ position: 'relative', zIndex: 5, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top HUD Header */}
      <Header />

      {/* Navigation Matrix */}
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Tab View Container */}
      <main style={{ flex: 1, paddingTop: '20px' }}>
        {currentTab === 'dashboard' && (
          <DashboardView onOpenComms={() => setCurrentTab('comms')} />
        )}
        {currentTab === 'comms' && <CommsView />}
        {currentTab === 'audit' && <AuditView />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <GameProvider>
        {/* Deep Space Background Effects */}
        <StarField />
        <ScanlineOverlay />
        <HudCornerAccents />

        {/* Tactical UI Matrix */}
        <MainLayout />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
