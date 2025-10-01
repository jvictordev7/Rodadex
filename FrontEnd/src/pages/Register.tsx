import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Função para validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar senha
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Função para verificar força da senha
  const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, text: 'Fraca', color: '#ff4444' };
    if (score <= 3) return { score, text: 'Média', color: '#ff8800' };
    if (score <= 4) return { score, text: 'Boa', color: '#88aa00' };
    return { score, text: 'Forte', color: '#00aa44' };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Remove erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Nome deve ter no máximo 50 caracteres';
    }

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Digite um email válido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpar erros anteriores
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });
      
      addToast({
        type: 'success',
        title: 'Conta criada com sucesso!',
        message: `Bem-vindo ao Rodadex, ${formData.name}!`
      });
      
      navigate('/');
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Erro no registro:', error);
      
      let errorMessage = 'Erro ao criar conta. Verifique sua conexão e tente novamente.';
      
      // Tratar diferentes tipos de erro do AuthContext
      if (error.message) {
        if (error.message.includes('409')) {
          // Email já em uso
          errorMessage = 'Este email já está em uso. Tente outro email ou faça login.';
          setErrors({ email: errorMessage });
        } else if (error.message.includes('400')) {
          errorMessage = 'Dados inválidos. Verifique as informações e tente novamente.';
          setErrors({ general: errorMessage });
        } else if (error.message.includes('500')) {
          errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
          setErrors({ general: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: errorMessage });
      }
      
      addToast({
        type: 'error',
        title: 'Erro ao criar conta',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page animate-fade-in">
      <div className="register-container">
        <div className="register-card animate-scale-in">
          <div className="register-header">
            <h1>🏆 Rodadex</h1>
            <p>Crie sua conta para acompanhar o futebol brasileiro</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {errors.general && (
              <div className="error-alert animate-shake">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
                placeholder="Digite seu nome completo"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
                placeholder="Digite seu email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  disabled={isLoading}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <span 
                    className="strength-text" 
                    style={{ color: getPasswordStrength(formData.password).color }}
                  >
                    Força: {getPasswordStrength(formData.password).text}
                  </span>
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${(getPasswordStrength(formData.password).score / 5) * 100}%`,
                        backgroundColor: getPasswordStrength(formData.password).color 
                      }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={isLoading}
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="success-text">✓ Senhas coincidem</span>
              )}
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="register-button hover-lift transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Já tem uma conta? {' '}
              <Link to="/login" className="login-link">
                Entre
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;