import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://rodadex.vercel.app';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

console.log('🔗 useApi - API URL configurada:', `${API_URL}/api`);

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('=== INTERCEPTOR AXIOS ===');
    console.log('Token encontrado:', !!token);
    console.log('URL da requisição:', config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Header Authorization adicionado:', config.headers.Authorization?.substring(0, 30) + '...');
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta para debug
api.interceptors.response.use(
  (response) => {
    console.log('=== RESPOSTA AXIOS ===');
    console.log('Status:', response.status);
    console.log('URL:', response.config.url);
    return response;
  },
  (error) => {
    console.error('=== ERRO AXIOS ===');
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
    console.error('Dados do erro:', error.response?.data);
    return Promise.reject(error);
  }
);

// Mock data para fixtures
const mockFixtures = [
  {
    id: 1,
    date: '2025-09-29T19:00:00Z',
    timestamp: Date.now(),
    status: { long: 'Not Started', short: 'NS' },
    league: {
      id: 71,
      name: 'Série A',
      country: 'Brazil',
      logo: '',
      flag: '',
      season: 2025,
      round: 'Regular Season - 28'
    },
    teams: {
      home: { id: 127, name: 'Flamengo', logo: 'https://media.api-sports.io/football/teams/124.png' },
      away: { id: 128, name: 'Palmeiras', logo: 'https://media.api-sports.io/football/teams/121.png' }
    },
    goals: { home: null, away: null }
  },
  {
    id: 2,
    date: '2025-09-29T21:30:00Z',
    timestamp: Date.now(),
    status: { long: 'Not Started', short: 'NS' },
    league: {
      id: 71,
      name: 'Série A',
      country: 'Brazil',
      logo: '',
      flag: '',
      season: 2025,
      round: 'Regular Season - 28'
    },
    teams: {
      home: { id: 129, name: 'São Paulo', logo: '' },
      away: { id: 131, name: 'Corinthians', logo: '' }
    },
    goals: { home: null, away: null }
  }
];

// Mock data para standings
const mockStandings = [
  {
    rank: 1,
    team: { id: 127, name: 'Botafogo', logo: 'https://media.api-sports.io/football/teams/127.png' },
    points: 70,
    goalsDiff: 28,
    form: 'WWWWW',
    all: { played: 32, win: 22, draw: 4, lose: 6, goals: { for: 58, against: 30 } }
  },
  {
    rank: 2,
    team: { id: 128, name: 'Palmeiras', logo: 'https://media.api-sports.io/football/teams/121.png' },
    points: 67,
    goalsDiff: 25,
    form: 'WWLWW',
    all: { played: 32, win: 20, draw: 7, lose: 5, goals: { for: 55, against: 30 } }
  },
  {
    rank: 3,
    team: { id: 129, name: 'Flamengo', logo: 'https://media.api-sports.io/football/teams/124.png' },
    points: 63,
    goalsDiff: 18,
    form: 'WLWWW',
    all: { played: 31, win: 19, draw: 6, lose: 6, goals: { for: 52, against: 34 } }
  },
  {
    rank: 4,
    team: { id: 130, name: 'Fortaleza', logo: 'https://media.api-sports.io/football/teams/131.png' },
    points: 60,
    goalsDiff: 12,
    form: 'LWWDW',
    all: { played: 32, win: 18, draw: 6, lose: 8, goals: { for: 45, against: 33 } }
  }
];

// Hook para próximos jogos da liga
export const useLeagueFixtures = (leagueId: number = 71, season: number = 2023) => {
  return useQuery({
    queryKey: ['fixtures', 'league', leagueId, season],
    queryFn: async () => {
      try {
        console.log('Carregando fixtures da API...');
        const response = await api.get(`/fixtures/league?league=${leagueId}&season=${season}&next=10`);
        
        if (response.data.response && Array.isArray(response.data.response)) {
          return response.data.response;
        }
        
        // Fallback para mock se não tiver dados
        console.log('Usando fixtures mock como fallback');
        return mockFixtures;
      } catch (error) {
        console.error('Erro ao buscar fixtures, usando mock:', error);
        return mockFixtures;
      }
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 dias - dados históricos não mudam
  });
};

// Hook para classificação da liga
export const useStandings = (leagueId: number = 71, season: number = 2023) => {
  return useQuery({
    queryKey: ['standings', leagueId, season],
    queryFn: async () => {
      try {
        console.log('Carregando standings da API...');
        const response = await api.get(`/standings?league=${leagueId}&season=${season}`);
        
        if (response.data.response && response.data.response.length > 0) {
          return response.data.response[0].league.standings[0];
        }
        
        // Fallback para mock se não tiver dados
        console.log('Usando dados mock como fallback');
        return mockStandings;
      } catch (error) {
        console.error('Erro ao buscar standings, usando mock:', error);
        return mockStandings;
      }
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 dias - classificação final não muda
  });
};

// Hook para favoritos do usuário
export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['favorites', user?.id], // Inclui userId na key para cache separado por usuário
    queryFn: async () => {
      try {
        console.log('=== CARREGANDO FAVORITOS ===');
        const token = localStorage.getItem('token');
        console.log('Token encontrado:', !!token);
        
        if (!token || !isAuthenticated) {
          console.log('Usuário não autenticado, retornando array vazio');
          return [];
        }

        console.log('Fazendo requisição para /favorites...');
        const response = await api.get('/favorites');

        console.log('Resposta da API:', response.data);
        // A API pode retornar um array direto ou um objeto com propriedade favorites
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return response.data.favorites || [];
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        return []; // Retorna array vazio em caso de erro
      }
    },
    enabled: isAuthenticated && !!user, // Só executa se usuário estiver autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos - favoritos podem mudar mais frequentemente
  });
};

// Hook otimizado para detalhes do time (ZERO API calls extras - usa cache!)
export const useTeamDetails = (teamId: number) => {
  const { data: standings } = useStandings(); // Reutiliza dados já carregados
  const { data: fixtures } = useLeagueFixtures(); // Reutiliza dados já carregados
  
  return useQuery({
    queryKey: ['team-details', teamId],
    queryFn: () => {
      // INTELIGENTE: Extrai dados do time dos caches existentes!
      const teamStanding = standings?.find((team: any) => team.team.id === teamId);
      const teamFixtures = fixtures?.filter((fixture: any) => 
        fixture.teams.home.id === teamId || fixture.teams.away.id === teamId
      );
      
      if (!teamStanding) {
        throw new Error('Time não encontrado');
      }
      
      return {
        team: teamStanding.team,
        stats: {
          position: teamStanding.rank,
          points: teamStanding.points,
          played: teamStanding.all.played,
          wins: teamStanding.all.win,
          draws: teamStanding.all.draw,
          losses: teamStanding.all.lose,
          goalsFor: teamStanding.all.goals.for,
          goalsAgainst: teamStanding.all.goals.against,
          goalDifference: teamStanding.goalsDiff,
          form: teamStanding.form,
          winPercentage: Math.round((teamStanding.all.win / teamStanding.all.played) * 100),
          avgGoalsFor: (teamStanding.all.goals.for / teamStanding.all.played).toFixed(1),
          avgGoalsAgainst: (teamStanding.all.goals.against / teamStanding.all.played).toFixed(1)
        },
        fixtures: teamFixtures || [],
        lastUpdated: new Date().toISOString()
      };
    },
    enabled: !!standings && !!teamId, // Só executa quando já temos os dados base
    staleTime: 24 * 60 * 60 * 1000, // 24 horas - dados históricos
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 dias na memória
  });
};

// Hook para adicionar favorito
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ teamId, teamName }: { teamId: number; teamName: string }) => {
      try {
        console.log('=== ADICIONANDO FAVORITO ===');
        console.log('Dados:', { teamId, teamName });
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        console.log('Token disponível:', token.substring(0, 20) + '...');
        
        const response = await api.post('/favorites', { teamId, teamName });
        
        console.log('Favorito adicionado com sucesso:', response.data);
        return response.data;
      } catch (error: unknown) {
        const err = error as { message: string; response?: { status: number; data: unknown; headers: unknown } };
        console.error('Erro detalhado ao adicionar favorito:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Invalidando cache de favoritos...');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

// Hook para remover favorito
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (teamId: number) => {
      try {
        console.log('=== REMOVENDO FAVORITO ===');
        console.log('Team ID:', teamId);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        console.log('Token disponível:', token.substring(0, 20) + '...');
        
        const response = await api.delete(`/favorites/${teamId}`);
        
        console.log('Favorito removido com sucesso:', response.data);
        return response.data;
      } catch (error: unknown) {
        const err = error as { message: string; response?: { status: number; data: unknown } };
        console.error('Erro detalhado ao remover favorito:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Invalidando cache de favoritos...');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};