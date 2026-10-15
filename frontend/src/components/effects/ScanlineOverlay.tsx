import React from 'react';

interface ScanlineOverlayProps {
  showCrosshairs?: boolean;
}

export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({ showCrosshairs = true }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* CRT Scanline pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.65,
        }}
      />

      {/* Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, transparent 60%, rgba(6, 6, 8, 0.85) 100%)',
        }}
      />

      {/* Tactical Crosshair watermark */}
      {showCrosshairs && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 24,
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(220, 38, 38, 0.35)',
              letterSpacing: '2px',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}
          >
            SYS.STATUS // DIRECTIVE_HAIL_MARY // 114.28.90
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: 24,
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.2)',
              letterSpacing: '2px',
              writingMode: 'vertical-rl',
            }}
          >
            ENCRYPTION // QUANTUM_NEURAL_ROUTING
          </div>
        </>
      )}
    </div>
  );
};
