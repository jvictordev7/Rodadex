import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  type = 'error' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-message ${type}`}>
      <div className="error-content">
        <span className="error-icon">{getIcon()}</span>
        <p className="error-text">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;