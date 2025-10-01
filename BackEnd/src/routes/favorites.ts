import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Todas as rotas de favoritos requerem autenticação
router.use(authenticateToken);

router.get('/', FavoriteController.getFavorites);
router.post('/', FavoriteController.addFavorite);
router.delete('/:teamId', FavoriteController.removeFavorite);
router.get('/:teamId/check', FavoriteController.isFavorite);

export default router;