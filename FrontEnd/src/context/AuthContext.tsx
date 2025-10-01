import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Definindo tipos localmente para evitar problemas de import
interface User {
  id: string | number; // Compatível com backend que retorna string
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Inicializar usuário do localStorage quando a página carrega
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('Usuário recuperado do localStorage:', parsedUser);
      } catch (error) {
        console.error('Erro ao parsear usuário do localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      console.log('=== TENTANDO LOGIN ===');
      console.log('Credenciais:', { email: credentials.email, password: '***' });
      
      // Tentando fazer login real no backend
      const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://rodadex.vercel.app';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta:', errorData);
        throw new Error(`Erro no login: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Login bem-sucedido:', { user: data.user, token: data.token?.substring(0, 20) + '...' });
      
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Erro no login:', error);
      // Remove dados antigos se existirem
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      throw error; // Re-lança o erro para que a UI possa tratar
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      console.log('=== TENTANDO REGISTRO ===');
      console.log('Credenciais:', { name: credentials.name, email: credentials.email, password: '***' });
      
      // Fazendo registro real no backend
      const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://rodadex.vercel.app';
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Status da resposta registro:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta registro:', errorData);
        throw new Error(`Erro no registro: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Registro bem-sucedido:', { user: data.user, token: data.token?.substring(0, 20) + '...' });
      
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Erro no registro:', error);
      // Remove dados antigos se existirem
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      throw error; // Re-lança o erro para que a UI possa tratar
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Limpar cache do React Query, especialmente os favoritos
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
    queryClient.removeQueries({ queryKey: ['favorites'] });
    queryClient.clear(); // Limpa todo o cache para garantir
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};