import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    addToast({
      type: 'info',
      title: `Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`,
      message: `Interface alterada para o modo ${newTheme === 'dark' ? 'escuro' : 'claro'}`,
      duration: 2000
    });
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Modo ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="theme-toggle-container">
        <div className={`theme-toggle-slider ${theme}`}>
          <span className="theme-icon sun">☀️</span>
          <span className="theme-icon moon">🌙</span>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;