import React, { useEffect, useState } from 'react';
import type { Toast, ToastType } from '../../context/ToastContext';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

interface ToastProps {
  toast: Toast;
}

const ToastComponent: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrada animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Tempo da animação de saída
  };

  const getIcon = (type: ToastType): string => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getProgressColor = (type: ToastType): string => {
    switch (type) {
      case 'success': return '#4ade80';
      case 'error': return '#f87171';
      case 'warning': return '#fbbf24';
      case 'info': return '#60a5fa';
      default: return '#60a5fa';
    }
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''} ${isExiting ? 'toast-exiting' : ''}`}
    >
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon(toast.type)}
        </div>
        
        <div className="toast-text">
          <div className="toast-title">
            {toast.title}
          </div>
          {toast.message && (
            <div className="toast-message">
              {toast.message}
            </div>
          )}
        </div>

        <div className="toast-actions">
          {toast.action && (
            <button 
              className="toast-action-btn"
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </button>
          )}
          
          <button 
            className="toast-close-btn"
            onClick={handleClose}
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Barra de progresso */}
      {toast.duration && toast.duration > 0 && (
        <div 
          className="toast-progress"
          style={{ 
            backgroundColor: getProgressColor(toast.type),
            animationDuration: `${toast.duration}ms`
          }}
        />
      )}
    </div>
  );
};

export default ToastComponent;