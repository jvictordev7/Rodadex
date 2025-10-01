import type { Request, Response } from 'express';
import { footballService } from '../services/footballService.js';

export class FixturesController {
  // GET /fixtures/next?teamId=131&next=1
  static async getNextFixtures(req: Request, res: Response): Promise<void> {
    try {
      const teamId = parseInt(req.query.teamId as string);
      const next = parseInt(req.query.next as string) || 5;

      if (!teamId || isNaN(teamId)) {
        res.status(400).json({ error: 'teamId é obrigatório e deve ser um número' });
        return;
      }

      const data = await footballService.getTeamNextFixtures(teamId, next);
      res.json(data);
    } catch (error) {
      console.error('Erro em getNextFixtures:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }

  // GET /fixtures/league?leagueId=71&season=2025&next=20
  static async getLeagueFixtures(req: Request, res: Response): Promise<void> {
    try {
      const leagueId = parseInt(req.query.leagueId as string) || 71;
      const season = parseInt(req.query.season as string) || 2025;
      const next = parseInt(req.query.next as string) || 20;

      const data = await footballService.getLeagueNextFixtures(leagueId, season, next);
      res.json(data);
    } catch (error) {
      console.error('Erro em getLeagueFixtures:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }
}

export class StandingsController {
  // GET /standings?leagueId=71&season=2025
  static async getStandings(req: Request, res: Response): Promise<void> {
    try {
      const leagueId = parseInt(req.query.leagueId as string) || 71;
      const season = parseInt(req.query.season as string) || 2025;

      const data = await footballService.getLeagueStandings(leagueId, season);
      res.json(data);
    } catch (error) {
      console.error('Erro em getStandings:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }
}

export class MediaController {
  // GET /media/team?name=Cruzeiro
  static async getTeamMedia(req: Request, res: Response): Promise<void> {
    try {
      const teamName = req.query.name as string;

      if (!teamName) {
        res.status(400).json({ error: 'name é obrigatório' });
        return;
      }

      const data = await footballService.getTeamMedia(teamName);
      
      if (data.error === 'Team not found in media database') {
        res.status(404).json({ error: 'Team not found' });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error('Erro em getTeamMedia:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }
}

export class TeamsController {
  // GET /teams/:id
  static async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const teamIdParam = req.params.id;
      if (!teamIdParam) {
        res.status(400).json({ error: 'ID do time é obrigatório' });
        return;
      }
      
      const teamId = parseInt(teamIdParam);
      if (isNaN(teamId)) {
        res.status(400).json({ error: 'ID do time inválido' });
        return;
      }

      const data = await footballService.getTeamById(teamId);
      res.json(data);
    } catch (error) {
      console.error('Erro em getTeamById:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }

  // GET /teams/search?name=Cruzeiro&league=71
  static async searchTeams(req: Request, res: Response): Promise<void> {
    try {
      const name = req.query.name as string;
      const league = parseInt(req.query.league as string) || 71;

      if (!name) {
        res.status(400).json({ error: 'name é obrigatório' });
        return;
      }

      const data = await footballService.searchTeamsByName(name, league);
      res.json(data);
    } catch (error) {
      console.error('Erro em searchTeams:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }

  // GET /teams/combined?name=Cruzeiro&next=1
  static async getTeamCombined(req: Request, res: Response): Promise<void> {
    try {
      const teamName = req.query.name as string;
      const next = parseInt(req.query.next as string) || 1;

      if (!teamName) {
        res.status(400).json({ error: 'name é obrigatório' });
        return;
      }

      const data = await footballService.getTeamCombined(teamName, next);
      res.json(data);
    } catch (error) {
      console.error('Erro em getTeamCombined:', error);
      res.status(502).json({ error: 'Upstream error' });
    }
  }
}