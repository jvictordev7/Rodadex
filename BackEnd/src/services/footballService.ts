import axios, { type AxiosInstance } from 'axios';
import type { FootballStanding, FootballMatch, FootballTeam } from '../types/index.js';
import { getCache, setCache, TTL } from './cacheService.js';

class FootballService {
  private footballApi: AxiosInstance;
  private sportsDbApi: AxiosInstance;

  constructor() {
    // Configuração API-FOOTBALL (dados dos jogos)
    this.footballApi = axios.create({
      baseURL: process.env.FOOTBALL_API_BASE || 'https://v3.football.api-sports.io',
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY || '',
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });

    // Configuração TheSportsDB (imagens/logos)
    this.sportsDbApi = axios.create({
      baseURL: `https://www.thesportsdb.com/api/v1/json/${process.env.THESPORTSDB_KEY || '3'}`
    });
  }

  private isValidConfig(): boolean {
    return Boolean(process.env.FOOTBALL_API_KEY);
  }

  private normalizeTeamName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
      .trim();
  }

  // 1. Próximos jogos de um time (sem next para plano gratuito)
  async getTeamNextFixtures(teamId: number, next: number = 5): Promise<any> {
    const cacheKey = `fixtures:team:${teamId}`;
    
    try {
      const cached = await getCache(cacheKey);
      if (cached) return { ...cached, fromCache: true };

      // Para plano gratuito, buscar jogos em uma temporada específica
      const response = await this.footballApi.get('/fixtures', {
        params: { 
          team: teamId, 
          season: 2023  // Usar temporada compatível com plano gratuito
        }
      });

      await setCache(cacheKey, response.data, TTL.FIXTURES);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar próximos jogos:', error);
      
      // Tentar retornar cache stale se houver
      const staleCache = await getCache(cacheKey);
      if (staleCache) {
        return { ...staleCache, warning: 'stale', fromCache: true };
      }
      
      throw new Error('Erro ao buscar dados da API de futebol');
    }
  }

  // 2. Próximos jogos da liga (rodada/agenda)
  async getLeagueNextFixtures(leagueId: number = 71, season: number = 2023, next: number = 20): Promise<any> {
    const cacheKey = `fixtures:league:${leagueId}:${season}`;
    
    try {
      const cached = await getCache(cacheKey);
      if (cached) return { ...cached, fromCache: true };

      // Para plano gratuito, usar temporada 2023 e buscar por rodada
      const response = await this.footballApi.get('/fixtures', {
        params: { 
          league: leagueId, 
          season: 2023,  // Usar temporada compatível
          round: "Regular Season - 1"  // Exemplo de rodada
        }
      });

      await setCache(cacheKey, response.data, TTL.FIXTURES);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agenda da liga:', error);
      
      const staleCache = await getCache(cacheKey);
      if (staleCache) {
        return { ...staleCache, warning: 'stale', fromCache: true };
      }
      
      throw new Error('Erro ao buscar dados da API de futebol');
    }
  }

  // 3. Classificação da liga
  async getLeagueStandings(leagueId: number = 71, season: number = 2023): Promise<any> {
    const cacheKey = `standings:${leagueId}:${season}`;
    
    try {
      const cached = await getCache(cacheKey);
      if (cached) return { ...cached, fromCache: true };

      const response = await this.footballApi.get('/standings', {
        params: { league: leagueId, season: season || 2023 }  // Usar 2023 como padrão
      });

      await setCache(cacheKey, response.data, TTL.STANDINGS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar classificação:', error);
      
      const staleCache = await getCache(cacheKey);
      if (staleCache) {
        return { ...staleCache, warning: 'stale', fromCache: true };
      }
      
      throw new Error('Erro ao buscar dados da API de futebol');
    }
  }

  // 4. Buscar time por ID para obter nome exato
  async getTeamById(teamId: number): Promise<any> {
    const cacheKey = `team:${teamId}`;
    
    try {
      const cached = await getCache(cacheKey);
      if (cached) return { ...cached, fromCache: true };

      const response = await this.footballApi.get('/teams', {
        params: { id: teamId }
      });

      await setCache(cacheKey, response.data, TTL.TEAM_DATA);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar time:', error);
      throw new Error('Erro ao buscar dados do time');
    }
  }

  // 5. Buscar teams por nome (para obter teamID)
  async searchTeamsByName(query: string, league: number = 71): Promise<any> {
    const cacheKey = `teams:search:${this.normalizeTeamName(query)}:${league}`;
    
    try {
      const cached = await getCache(cacheKey);
      if (cached) return { ...cached, fromCache: true };

      const response = await this.footballApi.get('/teams', {
        params: { search: query, league }
      });

      await setCache(cacheKey, response.data, TTL.TEAM_DATA);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      throw new Error('Erro ao buscar times');
    }
  }

  // 6. Dados visuais de um time (escudo/logo) - TheSportsDB
  async getTeamMedia(teamName: string): Promise<any> {
    const normalizedName = this.normalizeTeamName(teamName);
    const cacheKey = `media:team:${normalizedName}`;
    
    try {
      const cached = await getCache(cacheKey);
      if (cached) return { ...cached, fromCache: true };

      const response = await this.sportsDbApi.get('/searchteams.php', {
        params: { t: teamName }
      });

      if (!response.data?.teams?.length) {
        return { error: 'Team not found in media database' };
      }

      const team = response.data.teams[0];
      const dto = {
        teamName: team.strTeam,
        badge: team.strTeamBadge,
        banner: team.strTeamBanner || team.strTeamFanart1,
        stadium: team.strStadiumThumb,
        description: team.strDescriptionEN
      };

      await setCache(cacheKey, dto, TTL.TEAM_MEDIA);
      return dto;
    } catch (error) {
      console.error('Erro ao buscar mídia do time:', error);
      return { error: 'Failed to fetch team media' };
    }
  }

  // 7. Endpoint combo - dados completos de um time
  async getTeamCombined(teamName: string, next: number = 1): Promise<any> {
    try {
      // 1. Buscar teamId pelo nome
      const teamsResponse = await this.searchTeamsByName(teamName);
      if (!teamsResponse.response?.length) {
        throw new Error('Time não encontrado');
      }

      const team = teamsResponse.response[0].team;
      
      // 2. Buscar próximas partidas
      const fixturesResponse = await this.getTeamNextFixtures(team.id, next);
      
      // 3. Buscar dados visuais
      const mediaResponse = await this.getTeamMedia(team.name);

      // 4. Montar DTO unificado
      const dto = {
        team: {
          id: team.id,
          name: team.name,
          country: team.country,
          founded: team.founded,
          venue: team.venue
        },
        media: mediaResponse.error ? null : mediaResponse,
        nextFixtures: fixturesResponse.response || [],
        fromCache: {
          team: teamsResponse.fromCache || false,
          fixtures: fixturesResponse.fromCache || false,
          media: mediaResponse.fromCache || false
        }
      };

      return dto;
    } catch (error) {
      console.error('Erro ao buscar dados combinados:', error);
      throw error;
    }
  }

  // Métodos mock para desenvolvimento (quando a API não está configurada)
  getMockStandings(): FootballStanding[] {
    return [
      {
        rank: 1,
        team: { id: 131, name: 'Palmeiras', logo: '/logos/palmeiras.png' },
        points: 70,
        goalsDiff: 20,
        group: 'Série A',
        form: 'WWWWD',
        status: 'same',
        description: 'Promotion - Copa Libertadores',
        all: {
          played: 34,
          win: 21,
          draw: 7,
          lose: 6,
          goals: { for: 58, against: 38 }
        }
      },
      {
        rank: 2,
        team: { id: 127, name: 'Flamengo', logo: '/logos/flamengo.png' },
        points: 68,
        goalsDiff: 18,
        group: 'Série A',
        form: 'WWDWW',
        status: 'same',
        description: 'Promotion - Copa Libertadores',
        all: {
          played: 34,
          win: 20,
          draw: 8,
          lose: 6,
          goals: { for: 56, against: 38 }
        }
      }
    ];
  }

  getMockMatches(): FootballMatch[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
      {
        fixture: {
          id: 1,
          date: tomorrow.toISOString(),
          status: { short: 'NS', long: 'Not Started' }
        },
        teams: {
          home: { id: 131, name: 'Palmeiras', logo: '/logos/palmeiras.png' },
          away: { id: 127, name: 'Flamengo', logo: '/logos/flamengo.png' }
        },
        goals: { home: null, away: null },
        score: { fulltime: { home: null, away: null } }
      }
    ];
  }
}

export const footballService = new FootballService();