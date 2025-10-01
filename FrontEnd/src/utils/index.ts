// Utilitários para formatação e helpers

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getMatchStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'NS': 'Não iniciado',
    'LIVE': 'Ao vivo',
    'HT': 'Intervalo',
    'FT': 'Finalizado',
    'AET': 'Fim prorrogação',
    'PEN': 'Pênaltis',
    'SUSP': 'Suspenso',
    'PST': 'Adiado',
    'CANC': 'Cancelado',
    'ABD': 'Abandonado',
    'AWD': 'Walkover',
    'WO': 'Walkover',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'LIVE':
    case 'HT':
      return '#28a745'; // Verde para jogos ao vivo
    case 'FT':
    case 'AET':
    case 'PEN':
      return '#6c757d'; // Cinza para jogos finalizados
    case 'NS':
      return '#007bff'; // Azul para jogos não iniciados
    case 'SUSP':
    case 'PST':
    case 'CANC':
    case 'ABD':
      return '#dc3545'; // Vermelho para problemas
    default:
      return '#6c757d';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const getTeamPosition = (position: number): string => {
  if (position <= 4) return 'libertadores';
  if (position <= 6) return 'libertadores-qualif';
  if (position <= 12) return 'sulamericana';
  if (position >= 17) return 'rebaixamento';
  return 'normal';
};

export const getPositionColor = (position: number): string => {
  if (position <= 4) return '#1e90ff'; // Azul - Libertadores
  if (position <= 6) return '#87ceeb'; // Azul claro - Pré-Libertadores
  if (position <= 12) return '#ffa500'; // Laranja - Sul-Americana
  if (position >= 17) return '#ff4500'; // Vermelho - Rebaixamento
  return '#f8f9fa'; // Cinza claro - Normal
};

export const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};