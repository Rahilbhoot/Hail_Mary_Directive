import React from 'react';
import type { ViewTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { soundFx } from '../../services/audio';
import { LayoutDashboard, MessageSquareCode, ShieldCheck, AlertCircle } from 'lucide-react';

interface NavigationProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { currentUser } = useAuth();
  const { activeSession, messages } = useGame();

  const handleSelectTab = (tab: ViewTab) => {
    soundFx.playKeyClick();
    onTabChange(tab);
  };

  const tamperedCount = messages.filter((m) => m.tampered).length;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 28px',
        background: 'rgba(12, 12, 18, 0.75)',
        borderBottom: '1px solid var(--border-void)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Tab 1: Mission Control */}
      <button
        onClick={() => handleSelectTab('dashboard')}
        className="hud-cut-corners"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: currentTab === 'dashboard' ? 'var(--accent-red-pure)' : 'rgba(255, 255, 255, 0.03)',
          color: currentTab === 'dashboard' ? '#ffffff' : 'var(--text-silver)',
          border: `1px solid ${currentTab === 'dashboard' ? 'var(--accent-red-bright)' : 'var(--border-void)'}`,
          boxShadow: currentTab === 'dashboard' ? 'var(--glow-red-md)' : 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          transition: 'all var(--transition-fast)',
        }}
      >
        <LayoutDashboard size={15} />
        MISSION CONTROL
      </button>

      {/* Tab 2: Comms Terminal */}
      <button
        onClick={() => handleSelectTab('comms')}
        className="hud-cut-corners"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: currentTab === 'comms' ? 'var(--accent-red-pure)' : 'rgba(255, 255, 255, 0.03)',
          color: currentTab === 'comms' ? '#ffffff' : 'var(--text-silver)',
          border: `1px solid ${currentTab === 'comms' ? 'var(--accent-red-bright)' : 'var(--border-void)'}`,
          boxShadow: currentTab === 'comms' ? 'var(--glow-red-md)' : 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          transition: 'all var(--transition-fast)',
          position: 'relative',
        }}
      >
        <MessageSquareCode size={15} />
        COMMS TERMINAL
        {activeSession && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              background: activeSession.token_found ? 'rgba(16, 185, 129, 0.3)' : 'rgba(220, 38, 38, 0.3)',
              color: activeSession.token_found ? '#34d399' : '#ff4d5a',
              border: `1px solid ${activeSession.token_found ? '#10b981' : '#dc2626'}`,
            }}
          >
            #{activeSession.session_id}
          </span>
        )}
      </button>

      {/* Tab 3: Classified Audit Matrix (Highlighted for ADMIN) */}
      <button
        onClick={() => handleSelectTab('audit')}
        className="hud-cut-corners"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: currentTab === 'audit' ? 'var(--accent-red-pure)' : 'rgba(255, 255, 255, 0.03)',
          color: currentTab === 'audit' ? '#ffffff' : 'var(--text-silver)',
          border: `1px solid ${currentTab === 'audit' ? 'var(--accent-red-bright)' : 'var(--border-void)'}`,
          boxShadow: currentTab === 'audit' ? 'var(--glow-red-md)' : 'none',
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          transition: 'all var(--transition-fast)',
        }}
      >
        <ShieldCheck size={15} />
        AUDIT MATRIX
        {currentUser?.role === 'ADMIN' && (
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(239, 68, 68, 0.25)',
              color: '#ffffff',
              border: '1px solid var(--accent-red-bright)',
            }}
          >
            CLASSIFIED
          </span>
        )}
        {tamperedCount > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(220, 38, 38, 0.85)',
              color: '#ffffff',
            }}
          >
            <AlertCircle size={10} />
            {tamperedCount}
          </span>
        )}
      </button>
    </nav>
  );
};
