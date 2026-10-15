import React from 'react';

interface TacticalCardProps {
  title?: string;
  badge?: string;
  badgeVariant?: 'red' | 'green' | 'amber';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hasCutCorners?: boolean;
  glow?: boolean;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  title,
  badge,
  badgeVariant = 'red',
  children,
  style = {},
  className = '',
  hasCutCorners = true,
  glow = false,
}) => {
  const getBadgeColor = () => {
    switch (badgeVariant) {
      case 'green':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.35)' };
      case 'amber':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.35)' };
      default:
        return { bg: 'rgba(220, 38, 38, 0.15)', text: 'var(--accent-red-bright)', border: 'rgba(220, 38, 38, 0.4)' };
    }
  };

  const badgeStyle = getBadgeColor();

  return (
    <div
      className={`tactical-card ${hasCutCorners ? 'hud-cut-corners' : ''} ${className}`}
      style={{
        background: 'var(--bg-glass-heavy)',
        border: '1px solid var(--border-void)',
        position: 'relative',
        backdropFilter: 'blur(16px)',
        transition: 'all var(--transition-normal)',
        boxShadow: glow ? 'var(--glow-red-subtle)' : '0 8px 32px rgba(0, 0, 0, 0.45)',
        ...style,
      }}
    >
      {/* Top red accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '12px',
          right: '12px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--accent-red-pure), transparent)',
          opacity: 0.8,
        }}
      />

      {/* Header if title provided */}
      {title && (
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.015)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                background: 'var(--accent-red-pure)',
                boxShadow: 'var(--glow-text-red)',
                borderRadius: '50%',
              }}
            />
            <h3
              style={{
                fontSize: '13px',
                letterSpacing: '1.5px',
                margin: 0,
                color: 'var(--text-white)',
              }}
            >
              {title}
            </h3>
          </div>

          {badge && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: 'var(--radius-xs)',
                background: badgeStyle.bg,
                color: badgeStyle.text,
                border: `1px solid ${badgeStyle.border}`,
                letterSpacing: '1px',
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Card Content */}
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
};
