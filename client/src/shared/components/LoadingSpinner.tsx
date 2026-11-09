import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3b82f6',
  backgroundColor = '#f3f4f6',
  label = 'Cargando...',
  fullScreen = false,
  className = ''
}) => {
  const sizeConfig = {
    small: { spinner: 24, border: 3, fontSize: '12px' },
    medium: { spinner: 40, border: 4, fontSize: '14px' },
    large: { spinner: 56, border: 5, fontSize: '16px' }
  };

  const config = sizeConfig[size];

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        gap: '16px'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        gap: '16px'
      };

  const spinnerStyle: React.CSSProperties = {
    width: `${config.spinner}px`,
    height: `${config.spinner}px`,
    border: `${config.border}px solid ${backgroundColor}`,
    borderTop: `${config.border}px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  const labelStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: config.fontSize,
    fontWeight: 500,
    letterSpacing: '0.5px'
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={`loading-spinner ${className}`}
        style={containerStyle}
      >
        <div style={spinnerStyle} aria-hidden="true" />
        <span style={labelStyle}>{label}</span>
        <span className="sr-only">Cargando contenido, por favor espere</span>
      </div>
    </>
  );
};

export default LoadingSpinner;