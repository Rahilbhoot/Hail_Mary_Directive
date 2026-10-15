import React from 'react';
import { useGame } from '../../context/GameContext';
import { TacticalCard } from '../ui/TacticalCard';
import { StatusBadge } from '../ui/StatusBadge';
import { RefreshCw } from 'lucide-react';
import { soundFx } from '../../services/audio';

export const OperativesList: React.FC = () => {
  const { allUsers, refreshUsers } = useGame();

  return (
    <TacticalCard
      title="REGISTERED OPERATIVES ROSTER"
      badge={`${allUsers.length} PERSONNEL`}
      badgeVariant="red"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
          CLEARANCE LISTING // CLASSIFIED PERSONNEL
        </p>
        <button
          onClick={() => {
            soundFx.playKeyClick();
            refreshUsers();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={12} />
          RELOAD
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '360px',
          overflowY: 'auto',
        }}
      >
        {allUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            No operatives recorded in database.
          </div>
        ) : (
          allUsers.map((user, idx) => (
            <div
              key={user.id || user.email || idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-void)',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: user.role === 'ADMIN' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${user.role === 'ADMIN' ? 'var(--accent-red-bright)' : 'var(--border-void)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: user.role === 'ADMIN' ? 'var(--accent-red-bright)' : '#ffffff',
                  }}
                >
                  {user.name.substring(0, 2).toUpperCase()}
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-hud)', fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                    {user.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <StatusBadge
                status={user.role === 'ADMIN' ? 'admin' : user.role === 'MC' ? 'mc' : 'ass'}
                customLabel={user.role}
                size="sm"
              />
            </div>
          ))
        )}
      </div>
    </TacticalCard>
  );
};
