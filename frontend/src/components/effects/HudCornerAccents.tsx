import React from 'react';

export const HudCornerAccents: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top Row Brackets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderTop: '2px solid var(--accent-red-pure)',
              borderLeft: '2px solid var(--accent-red-pure)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent-red-pure)',
              letterSpacing: '1px',
            }}
          >
            [DIRECTIVE_SYS // LIVE]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-dim)',
              letterSpacing: '1px',
            }}
          >
            GRID // 04-ORION
          </span>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderTop: '2px solid var(--accent-red-pure)',
              borderRight: '2px solid var(--accent-red-pure)',
            }}
          />
        </div>
      </div>

      {/* Bottom Row Brackets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderBottom: '2px solid var(--accent-red-pure)',
              borderLeft: '2px solid var(--accent-red-pure)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-dim)',
            }}
          >
            RESTRICTED // PROTOCOL 77-B
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-dim)',
            }}
          >
            OVERRIDE TOKEN: [HAIL_MARY]
          </span>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderBottom: '2px solid var(--accent-red-pure)',
              borderRight: '2px solid var(--accent-red-pure)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
