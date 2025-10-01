import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavoritesDropdownOpen, setIsFavoritesDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header animate-slide-down">
      <div className="header-container">
        <Link to="/" className="header-logo hover-scale transition-all">
          <h1>Rodadex</h1>
          <span>Brasileirão Série A</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link hover-lift transition-all">
            Home
          </Link>
          <Link to="/standings" className="nav-link hover-lift transition-all">
            Classificação
          </Link>
          
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="user-menu animate-fade-in-right">
              <span className="user-name">Olá, {user?.name}!</span>
              <div className="favorites-dropdown">
                <Link to="/favorites" className="nav-link hover-lift transition-all">
                  Favoritos ▼
                </Link>
                <div className="dropdown-content">
                  <Link to="/favorites" className="dropdown-link">
                    ⭐ Meus Favoritos
                  </Link>
                  <Link to="/favorites/history" className="dropdown-link">
                    📊 Histórico dos Jogos
                  </Link>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-button hover-scale transition-all">
                Sair
              </button>
            </div>
          ) : (
            <div className="auth-links animate-fade-in-right">
              <Link to="/login" className="nav-link hover-lift transition-all">
                Login
              </Link>
              <Link to="/register" className="nav-link register-link hover-lift transition-all">
                Cadastrar
              </Link>
            </div>
          )}
        </nav>

        {/* Controles Mobile - Theme Toggle + Menu Hambúrguer */}
        <div className="mobile-controls">
          <div className="mobile-theme-toggle">
            <ThemeToggle />
          </div>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav animate-fade-in">
            <div className="mobile-nav-links">
              <Link 
                to="/" 
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                to="/standings" 
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📊 Classificação
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="mobile-dropdown">
                    <div 
                      className="nav-link mobile-dropdown-toggle"
                      onClick={() => setIsFavoritesDropdownOpen(!isFavoritesDropdownOpen)}
                    >
                      <span>⭐ Favoritos</span>
                      <span>{isFavoritesDropdownOpen ? '▲' : '▼'}</span>
                    </div>
                    <div className={`mobile-dropdown-menu ${isFavoritesDropdownOpen ? 'active' : ''}`}>
                      <Link 
                        to="/favorites" 
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⭐ Meus Favoritos
                      </Link>
                      <Link 
                        to="/favorites/history" 
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        📊 Histórico dos Jogos
                      </Link>
                    </div>
                  </div>
                  <div className="nav-link" style={{ borderBottom: 'none', padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>Olá, {user?.name}!</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="nav-link"
                    style={{ border: 'none', background: 'none', color: 'white', textAlign: 'left' }}
                  >
                    🚪 Sair
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🔑 Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📝 Cadastrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;