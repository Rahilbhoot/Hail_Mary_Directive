import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { TacticalCard } from '../ui/TacticalCard';
import { GlowingButton } from '../ui/GlowingButton';
import { ShieldAlert, ShieldCheck, Download, Search, AlertTriangle } from 'lucide-react';
import { soundFx } from '../../services/audio';

export const AuditMatrix: React.FC = () => {
  const { messages, activeSession } = useGame();
  const { currentUser } = useAuth();
  const [filterMode, setFilterMode] = useState<'all' | 'tampered' | 'clean'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAdmin = currentUser?.role === 'ADMIN';

  const filteredMessages = messages.filter((m) => {
    const isTampered =
      m.tampered ??
      (m.delivered_message && m.original_message ? m.delivered_message !== m.original_message : false);

    if (filterMode === 'tampered' && !isTampered) return false;
    if (filterMode === 'clean' && isTampered) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inOrig = m.original_message.toLowerCase().includes(q);
      const inDeliv = m.delivered_message?.toLowerCase().includes(q) || false;
      const inUser = m.user_mail?.toLowerCase().includes(q) || false;
      return inOrig || inDeliv || inUser;
    }

    return true;
  });

  const handleExport = () => {
    soundFx.playKeyClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hail_mary_audit_session_${activeSession?.session_id || 'all'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const renderWordDiff = (orig: string, deliv?: string) => {
    if (!deliv) return <div style={{ color: 'var(--text-white)' }}>{orig}</div>;

    const origWords = orig.split(' ');
    const delivWords = deliv.split(' ');

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Raw transmission */}
        <div
          style={{
            padding: '10px 12px',
            background: 'rgba(220, 38, 38, 0.05)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, marginBottom: '6px' }}>
            RAW INTERCEPT (ORIGINAL):
          </div>
          <div style={{ color: 'var(--text-silver)', fontSize: '13px', lineHeight: 1.5 }}>
            {origWords.map((w, i) => {
              const changed = delivWords[i] !== w;
              return (
                <span
                  key={i}
                  style={{
                    color: changed ? '#ff4d5a' : 'inherit',
                    background: changed ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                    padding: changed ? '1px 4px' : '0',
                    borderRadius: '2px',
                    fontWeight: changed ? 700 : 400,
                  }}
                >
                  {w}{' '}
                </span>
              );
            })}
          </div>
        </div>

        {/* Delivered altered */}
        <div
          style={{
            padding: '10px 12px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>
            DELIVERED TO SQUAD:
          </div>
          <div style={{ color: 'var(--text-white)', fontSize: '13px', lineHeight: 1.5 }}>
            {delivWords.map((w, i) => {
              const changed = origWords[i] !== w;
              return (
                <span
                  key={i}
                  style={{
                    color: changed ? '#34d399' : 'inherit',
                    background: changed ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                    padding: changed ? '1px 4px' : '0',
                    borderRadius: '2px',
                    fontWeight: changed ? 700 : 400,
                  }}
                >
                  {w}{' '}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: '0 28px 24px 28px' }}>
      {/* Non-admin notice */}
      {!isAdmin && (
        <div
          style={{
            padding: '12px 20px',
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid var(--accent-red-pure)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-silver)',
          }}
        >
          <AlertTriangle size={18} color="var(--accent-red-bright)" />
          <span>
            RESTRICTED SECURITY NOTICE: Full neural interception audit requires ADMIN clearance. Field operatives may only inspect declassified logs.
          </span>
        </div>
      )}

      {/* Control bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'tampered', 'clean'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                soundFx.playKeyClick();
                setFilterMode(mode);
              }}
              className="hud-cut-corners"
              style={{
                padding: '6px 14px',
                background: filterMode === mode ? 'var(--accent-red-pure)' : 'rgba(255, 255, 255, 0.04)',
                color: filterMode === mode ? '#ffffff' : 'var(--text-silver)',
                border: `1px solid ${filterMode === mode ? 'var(--accent-red-bright)' : 'var(--border-void)'}`,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {mode === 'all' ? 'ALL LOGS' : mode === 'tampered' ? 'TAMPERED ONLY' : 'CLEAN'}
            </button>
          ))}
        </div>

        {/* Search & Export */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit transmissions..."
              style={{
                padding: '8px 12px',
                paddingLeft: '32px',
                fontSize: '12px',
                width: '240px',
              }}
            />
            <Search
              size={14}
              color="var(--text-dim)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <GlowingButton
            size="sm"
            variant="outline"
            icon={<Download size={13} />}
            onClick={handleExport}
          >
            EXPORT AUDIT JSON
          </GlowingButton>
        </div>
      </div>

      {/* Audit Log Table / Stream */}
      {filteredMessages.length === 0 ? (
        <TacticalCard style={{ textAlign: 'center', padding: '48px 20px' }}>
          <ShieldCheck size={36} color="var(--border-void)" style={{ marginBottom: '12px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-silver)', fontSize: '14px' }}>
            NO AUDIT RECORDS MATCHING CURRENT CRITERIA
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '12px', marginTop: '6px' }}>
            Transmit directives in Comms Terminal to generate cryptographic intercept records.
          </p>
        </TacticalCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredMessages.map((msg, idx) => {
            const isTampered =
              msg.tampered ??
              (msg.delivered_message && msg.original_message
                ? msg.delivered_message !== msg.original_message
                : false);

            return (
              <TacticalCard
                key={msg.id || idx}
                style={{
                  borderLeft: `4px solid ${isTampered ? 'var(--accent-red-bright)' : '#10b981'}`,
                }}
              >
                {/* Entry header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--text-white)', fontWeight: 700 }}>
                      TRANS-ID #{msg.id || idx + 1}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <span style={{ color: 'var(--accent-red-bright)' }}>
                      OPERATIVE: {msg.user_mail || 'CLASSIFIED'}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      CHANNEL #{msg.session_id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isTampered ? (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#ff4d5a',
                          background: 'rgba(220, 38, 38, 0.15)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid rgba(220, 38, 38, 0.4)',
                          fontWeight: 700,
                        }}
                      >
                        <ShieldAlert size={12} />
                        COVERT AI ALTERATION
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#34d399',
                          background: 'rgba(16, 185, 129, 0.15)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          fontWeight: 600,
                        }}
                      >
                        <ShieldCheck size={12} />
                        UNALTERED
                      </span>
                    )}

                    <span style={{ color: 'var(--text-dim)' }}>
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : 'RECENT'}
                    </span>
                  </div>
                </div>

                {/* Diff render */}
                {renderWordDiff(msg.original_message, msg.delivered_message)}
              </TacticalCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
