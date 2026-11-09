import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onDismiss,
  className = ''
}) => {
  const typeStyles = {
    error: {
      backgroundColor: '#fef2f2',
      borderColor: '#ef4444',
      color: '#b91c1c',
      icon: '⚠️'
    },
    warning: {
      backgroundColor: '#fffbeb',
      borderColor: '#f59e0b',
      color: '#b45309',
      icon: '⚡'
    },
    info: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
      color: '#1d4ed8',
      icon: 'ℹ️'
    }
  };

  const styles = typeStyles[type];

  const containerStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${styles.borderColor}`,
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0
  };

  const messageStyle: React.CSSProperties = {
    flex: 1,
    fontWeight: 500
  };

  const dismissButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: styles.color,
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    fontSize: '16px',
    lineHeight: 1
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`error-message ${className}`}
      style={containerStyle}
    >
      <span style={iconStyle} aria-hidden="true">{styles.icon}</span>
      <span style={messageStyle}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={dismissButtonStyle}
          aria-label="Cerrar mensaje"
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;