import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import ToastContainer from './components/Toast/ToastContainer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Standings from './pages/Standings';
import Favorites from './pages/Favorites';
import TeamDetails from './pages/TeamDetails';
import FavoritesHistory from './pages/FavoritesHistory';
import './App.css';
import './styles/theme.css';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 24 horas - dados históricos
      gcTime: 7 * 24 * 60 * 60 * 1000, // 7 dias - manter na memória
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <div className="app">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/standings" element={<Standings />} />
                    <Route path="/team/:id" element={<TeamDetails />} />
                    <Route 
                      path="/favorites" 
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/favorites/history" 
                      element={
                        <ProtectedRoute>
                          <FavoritesHistory />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <ToastContainer />
              </div>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;