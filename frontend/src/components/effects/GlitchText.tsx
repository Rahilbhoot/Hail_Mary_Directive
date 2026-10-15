import React from 'react';

interface GlitchTextProps {
  text: string;
  isGlitching?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  isGlitching = false,
  className = '',
  style = {},
}) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        position: 'relative',
        animation: isGlitching ? 'glitch-shake 0.35s infinite' : 'none',
        ...style,
      }}
    >
      {text}
      {isGlitching && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            color: 'var(--accent-red-bright)',
            clipPath: 'polygon(0 30%, 100% 30%, 100% 55%, 0 55%)',
            transform: 'translate(-2px, 1px)',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};
