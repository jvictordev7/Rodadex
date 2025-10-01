import React from 'react';
import { useToast } from '../../context/ToastContext';
import ToastComponent from './Toast';
import './ToastContainer.css';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;