import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  Favorite,
  Fixture,
  Standing,
  Team
} from '../types';
import { mockFixtures, mockStandings, mockUser, mockFavorites } from '../data/mockData';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://rodadex.vercel.app';

// Debug: Mostrar URL da API no console
console.log('🔗 API URL configurada:', API_BASE_URL);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);

// Flag para usar dados mock quando o backend não estiver disponível
const USE_MOCK_DATA = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      await delay(1500);
      // Simula sucesso no registro
      const response = {
        user: { ...mockUser, name: credentials.name, email: credentials.email },
        token: 'mock-jwt-token-12345'
      };
      return response;
    }
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      await delay(1200);
      // Simula sucesso no login
      if (credentials.email === 'demo@rodadex.com' && credentials.password === '123456') {
        return {
          user: mockUser,
          token: 'mock-jwt-token-12345'
        };
      }
      throw new Error('Email ou senha incorretos');
    }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockUser;
    }
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Armazenamento local de favoritos para modo mock
let localFavorites = [...mockFavorites];

// Serviços de Favoritos
export const favoritesService = {
  getFavorites: async (): Promise<Favorite[]> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return localFavorites;
    }
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (teamId: number, teamName: string): Promise<Favorite> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const newFavorite = {
        id: Date.now(),
        userId: 1,
        teamId,
        teamName,
        createdAt: new Date().toISOString()
      };
      localFavorites.push(newFavorite);
      return newFavorite;
    }
    const response = await api.post('/favorites', { teamId, teamName });
    return response.data;
  },

  removeFavorite: async (teamId: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      localFavorites = localFavorites.filter(f => f.teamId !== teamId);
      return;
    }
    await api.delete(`/favorites/${teamId}`);
  },
};

// Função para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Serviços de Futebol
export const footballService = {
  // Próximos jogos da liga
  getLeagueFixtures: async (leagueId: number = 71, season: number = 2023): Promise<Fixture[]> => {
    if (USE_MOCK_DATA) {
      await delay(1000); // Simula tempo de carregamento
      return mockFixtures as Fixture[];
    }
    const response = await api.get(`/fixtures/league?leagueId=${leagueId}&season=${season}`);
    return response.data;
  },

  // Próximos jogos de um time específico
  getTeamNextFixtures: async (teamId: number, next: number = 5): Promise<Fixture[]> => {
    if (USE_MOCK_DATA) {
      await delay(800);
      return mockFixtures.filter(f => 
        f.teams.home.id === teamId || f.teams.away.id === teamId
      ).slice(0, next) as Fixture[];
    }
    const response = await api.get(`/fixtures/next?teamId=${teamId}&next=${next}`);
    return response.data;
  },

  // Classificação da liga
  getStandings: async (leagueId: number = 71, season: number = 2023): Promise<Standing[]> => {
    if (USE_MOCK_DATA) {
      await delay(1200);
      return mockStandings as Standing[];
    }
    const response = await api.get(`/standings?leagueId=${leagueId}&season=${season}`);
    return response.data;
  },

  // Detalhes de um time
  getTeamDetails: async (teamId: number): Promise<Team> => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const team = mockStandings.find(s => s.team.id === teamId)?.team;
      if (!team) throw new Error('Time não encontrado');
      return team as Team;
    }
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },
};

export default api;
