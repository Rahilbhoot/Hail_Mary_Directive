import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { TacticalCard } from '../components/ui/TacticalCard';
import { GlowingButton } from '../components/ui/GlowingButton';
import { GlitchText } from '../components/effects/GlitchText';
import { Radio, ShieldAlert, UserCheck, ChevronRight, Lock } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { signin, signup, isLoading, error, clearError } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserRole>('ADMIN');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (isRegisterMode) {
      if (!name.trim() || !email.trim()) return;
      await signup(name, email, role);
    } else {
      if (!email.trim()) return;
      await signin(email);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    signin(demoEmail);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Futuristic Emblem & Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #dc2626 0%, #450a0a 100%)',
              border: '2px solid var(--accent-red-bright)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--glow-red-lg)',
              marginBottom: '16px',
            }}
          >
            <Radio size={32} color="#ffffff" />
          </div>

          <h1
            style={{
              fontSize: '26px',
              letterSpacing: '3px',
              marginBottom: '6px',
              color: '#ffffff',
            }}
          >
            HAIL MARY <span style={{ color: 'var(--accent-red-bright)' }}>DIRECTIVE</span>
          </h1>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--accent-red-bright)',
              letterSpacing: '2px',
            }}
          >
            <GlitchText text="[CLASSIFIED OPERATIONAL COMMS NETWORK]" isGlitching={true} />
          </div>
        </div>

        {/* Card */}
        <TacticalCard
          title={isRegisterMode ? 'ENLIST NEW OPERATIVE' : 'OPERATIVE ACCESS TERMINAL'}
          badge="SECURITY LEVEL 4"
          badgeVariant="red"
          glow={true}
        >
          {error && (
            <div
              style={{
                marginBottom: '18px',
                padding: '10px 14px',
                background: 'rgba(220, 38, 38, 0.2)',
                border: '1px solid var(--accent-red-pure)',
                borderRadius: 'var(--radius-xs)',
                color: '#ff4d5a',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegisterMode && (
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                    marginBottom: '6px',
                    letterSpacing: '1px',
                  }}
                >
                  CALLSIGN / OPERATIVE NAME:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Commander Shepard"
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  marginBottom: '6px',
                  letterSpacing: '1px',
                }}
              >
                NEURAL COMMS FREQUENCY (EMAIL):
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@directive.space"
                style={{ width: '100%' }}
              />
            </div>

            {isRegisterMode && (
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                    marginBottom: '6px',
                    letterSpacing: '1px',
                  }}
                >
                  SECURITY CLEARANCE ROLE:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['ADMIN', 'MC', 'ASS'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        padding: '10px 6px',
                        background: role === r ? 'var(--accent-red-pure)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${role === r ? 'var(--accent-red-bright)' : 'var(--border-void)'}`,
                        borderRadius: 'var(--radius-xs)',
                        color: role === r ? '#ffffff' : 'var(--text-silver)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-dim)',
                    marginTop: '6px',
                  }}
                >
                  {role === 'ADMIN' && 'ADMIN: Full command & raw AI tampering audit matrix inspection.'}
                  {role === 'MC' && 'MC: Mission Controller, coordinates operational directives.'}
                  {role === 'ASS' && 'ASS: Tactical Assistant Specialist with field channel access.'}
                </div>
              </div>
            )}

            <GlowingButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              style={{ width: '100%', marginTop: '8px' }}
              icon={isRegisterMode ? <UserCheck size={16} /> : <Lock size={16} />}
            >
              {isRegisterMode ? 'CONFIRM ENLISTMENT' : 'AUTHENTICATE CLEARANCE'}
            </GlowingButton>
          </form>

          {/* Toggle between Signin and Register */}
          <div
            style={{
              marginTop: '18px',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-dim)',
            }}
          >
            {isRegisterMode ? 'Already enlisted in database? ' : 'Unregistered operative? '}
            <button
              type="button"
              onClick={() => {
                clearError();
                setIsRegisterMode(!isRegisterMode);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-red-bright)',
                textDecoration: 'underline',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isRegisterMode ? 'Authenticate Callsign' : 'Enlist New Recruit'}
            </button>
          </div>

          {/* Quick Demo Credentials */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-dim)',
                letterSpacing: '1px',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Quick Operative Fast-Track:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('shepard@normandy.alliance')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-void)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--text-silver)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textAlign: 'left',
                }}
              >
                <span>Commander Shepard <span style={{ color: 'var(--accent-red-bright)' }}>[ADMIN]</span></span>
                <ChevronRight size={13} color="var(--accent-red-bright)" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('alpha@directive.space')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-void)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--text-silver)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textAlign: 'left',
                }}
              >
                <span>Operative Alpha <span style={{ color: '#c084fc' }}>[MC]</span></span>
                <ChevronRight size={13} color="var(--accent-red-bright)" />
              </button>
            </div>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
};
