import { Router } from 'express';
import { FixturesController, StandingsController, MediaController, TeamsController } from '../controllers/apiFootballController.js';
import { TestController } from '../controllers/testController.js';

const router = Router();

// Rota de teste
router.get('/test', TestController.testRoute);

// Fixtures (jogos/partidas)
router.get('/fixtures/next', FixturesController.getNextFixtures);
router.get('/fixtures/league', FixturesController.getLeagueFixtures);

// Standings (classificação)
router.get('/standings', StandingsController.getStandings);

// Media (imagens, logos)
router.get('/media/team', MediaController.getTeamMedia);

// Teams (times)
router.get('/teams/search', TeamsController.searchTeams);
router.get('/teams/combined', TeamsController.getTeamCombined);
router.get('/teams/:id', TeamsController.getTeamById);

export default router;