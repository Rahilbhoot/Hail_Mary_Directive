import React from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { TacticalCard } from '../ui/TacticalCard';
import { Radio, Users, ShieldAlert, KeyRound } from 'lucide-react';

export const TelemetryStats: React.FC = () => {
  const { currentUser } = useAuth();
  const { sessions, allUsers, messages, activeSession } = useGame();

  const isAdmin = currentUser?.role === 'ADMIN';
  const visibleSessions = isAdmin
    ? sessions
    : sessions.filter((s) => s.users?.includes(currentUser?.email || ''));

  const totalSessions = visibleSessions.length;
  const activeSessionsCount = visibleSessions.filter((s) => s.is_active).length;

  const mySquadEmails = new Set(visibleSessions.flatMap((s) => s.users || []));
  if (currentUser?.email) mySquadEmails.add(currentUser.email);
  const totalOperatives = isAdmin ? allUsers.length : mySquadEmails.size;

  const tamperedMessagesCount = messages.filter((m) => m.tampered).length;
  const isOverridden = activeSession?.token_found;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {/* Stat 1: Tactical Channels */}
      <TacticalCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
              {isAdmin ? 'CHANNELS ONLINE' : 'ASSIGNED CHANNELS'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'var(--text-white)', marginTop: '4px' }}>
              {activeSessionsCount} <span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/ {totalSessions}</span>
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
            }}
          >
            <Radio size={20} color="var(--accent-red-bright)" />
          </div>
        </div>
      </TacticalCard>

      {/* Stat 2: Active Operatives */}
      <TacticalCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
              {isAdmin ? 'ACTIVE RECRUITS' : 'SQUAD OPERATIVES'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'var(--text-white)', marginTop: '4px' }}>
              {totalOperatives}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
            }}
          >
            <Users size={20} color="#38bdf8" />
          </div>
        </div>
      </TacticalCard>

      {/* Stat 3: AI Interceptions */}
      <TacticalCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
              AI TAMPER COUNT
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 900,
                color: tamperedMessagesCount > 0 ? 'var(--accent-red-bright)' : 'var(--text-white)',
                marginTop: '4px',
              }}
            >
              {tamperedMessagesCount}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
            }}
          >
            <ShieldAlert size={20} color="var(--accent-red-bright)" />
          </div>
        </div>
      </TacticalCard>

      {/* Stat 4: Override State */}
      <TacticalCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px' }}>
              OVERRIDE PROTOCOL
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                fontWeight: 700,
                color: isOverridden ? '#34d399' : '#ff4d5a',
                marginTop: '10px',
                letterSpacing: '1px',
              }}
            >
              {isOverridden ? 'HAIL_MARY ENGAGED' : 'AWAITING KEY'}
            </div>
          </div>
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: isOverridden ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 38, 38, 0.15)',
              border: `1px solid ${isOverridden ? 'rgba(16, 185, 129, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`,
            }}
          >
            <KeyRound size={20} color={isOverridden ? '#10b981' : 'var(--accent-red-bright)'} />
          </div>
        </div>
      </TacticalCard>
    </div>
  );
};
