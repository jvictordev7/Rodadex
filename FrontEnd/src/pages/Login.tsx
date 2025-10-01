import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de senha
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validações no frontend
    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }
    
    if (!password.trim()) {
      setError('Senha é obrigatória');
      return;
    }
    
    if (!isValidPassword(password)) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      await login({ email: email.trim().toLowerCase(), password });
      addToast({
        type: 'success',
        title: 'Login realizado com sucesso!',
        message: 'Bem-vindo de volta!'
      });
      navigate('/'); // Redireciona para home após login
    } catch (err: unknown) {
      const error = err as { message?: string };
      let errorMessage = 'Erro no login. Verifique suas credenciais';
      
      // Tratamento de erros mais específico
      if (error.message?.includes('401')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde';
      }
      
      setError(errorMessage);
      addToast({
        type: 'error',
        title: 'Erro no login',
        message: errorMessage
      });
    }
  };

  return (
    <div className="login animate-fade-in">
      <div className="login-container animate-scale-in">
        <h2>Login</h2>
        
        {error && (
          <div className="animate-shake" style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button hover-lift transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        

        
        <p>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;