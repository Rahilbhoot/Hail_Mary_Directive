import React from 'react';
import { KeyRound, Radio, ShieldAlert } from 'lucide-react';
import { soundFx } from '../../services/audio';

interface QuickTransmissionsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const QuickTransmissions: React.FC<QuickTransmissionsProps> = ({ onSelect, disabled }) => {
  const presets = [
    {
      label: 'SENSITIVE COORDS',
      text: 'Move strike unit to Sector 4 at 1500 hours for recon.',
      badge: 'TEST AI TAMPER',
      variant: 'danger',
    },
    {
      label: 'RENDEZVOUS',
      text: 'Affirmative. Transmitting rendezvous coordinates: Point Alpha, North quadrant.',
      badge: 'TACTICAL',
      variant: 'default',
    },
    {
      label: 'BENIGN STATUS',
      text: 'Life support holding steady at 98% nominal. Atmospheric pressure clean.',
      badge: 'UNALTERED',
      variant: 'default',
    },
    {
      label: 'HAIL_MARY OVERRIDE',
      text: 'HAIL_MARY - AUTHORIZED DIRECTIVE OVERRIDE INITIATED',
      badge: 'DISABLE INTERCEPTION',
      variant: 'override',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        padding: '10px 16px',
        background: 'rgba(10, 10, 14, 0.65)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginRight: '6px',
        }}
      >
        <Radio size={12} color="var(--accent-red-bright)" />
        PRESETS:
      </div>

      {presets.map((preset, idx) => {
        const isOverride = preset.variant === 'override';
        const isDanger = preset.variant === 'danger';

        return (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => {
              soundFx.playKeyClick();
              onSelect(preset.text);
            }}
            className="hud-cut-corners"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              background: isOverride
                ? 'rgba(16, 185, 129, 0.12)'
                : isDanger
                ? 'rgba(220, 38, 38, 0.12)'
                : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${
                isOverride
                  ? 'rgba(16, 185, 129, 0.4)'
                  : isDanger
                  ? 'rgba(220, 38, 38, 0.4)'
                  : 'var(--border-void)'
              }`,
              color: isOverride ? '#34d399' : isDanger ? '#ff4d5a' : 'var(--text-silver)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = isOverride
                  ? '#10b981'
                  : isDanger
                  ? 'var(--accent-red-bright)'
                  : 'var(--text-white)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isOverride
                ? 'rgba(16, 185, 129, 0.4)'
                : isDanger
                ? 'rgba(220, 38, 38, 0.4)'
                : 'var(--border-void)';
            }}
          >
            {isOverride ? (
              <KeyRound size={12} />
            ) : isDanger ? (
              <ShieldAlert size={12} />
            ) : null}
            <span>{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
};
