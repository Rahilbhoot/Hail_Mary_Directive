import React from 'react';
import { soundFx } from '../../services/audio';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  onClick,
  style = {},
  disabled,
  className = '',
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    soundFx.playKeyClick();
    if (onClick) onClick(e);
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'var(--bg-surface-elevated)',
          color: 'var(--text-silver)',
          border: '1px solid var(--border-void)',
          boxShadow: 'none',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--accent-red-bright)',
          border: '1px solid var(--accent-red-pure)',
          boxShadow: '0 0 10px rgba(220, 38, 38, 0.2)',
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
          color: '#ffffff',
          border: '1px solid var(--accent-red-pure)',
          boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)',
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: '#ffffff',
          border: '1px solid var(--accent-red-bright)',
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.45)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 14px', fontSize: '12px', letterSpacing: '1px' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '15px', letterSpacing: '2px' };
      case 'md':
      default:
        return { padding: '10px 20px', fontSize: '13px', letterSpacing: '1.5px' };
    }
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={`hud-cut-corners ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        textTransform: 'uppercase',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = 'var(--glow-red-lg)';
            e.currentTarget.style.filter = 'brightness(1.15)';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.filter = 'none';
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.45)';
        }
      }}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'pulse-dot 0.6s linear infinite',
          }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
