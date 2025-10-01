import type { Request, Response } from 'express';
import { prisma } from '../index.js';
import { favoriteSchema } from '../utils/validation.js';
import type { FavoriteTeam } from '../types/index.js';

export class FavoriteController {
  static async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const favorites = await prisma.favorite.findMany({
        where: { userId: BigInt(req.user.userId) },
        orderBy: { createdAt: 'desc' }
      });

      const favoritesResponse: FavoriteTeam[] = favorites.map((fav: any) => ({
        id: fav.id.toString(),
        userId: fav.userId.toString(),
        teamId: fav.teamId,
        teamName: fav.teamName,
        createdAt: fav.createdAt.toISOString()
      }));

      res.json(favoritesResponse);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const validatedData = favoriteSchema.parse(req.body);
      const { teamId, teamName } = validatedData;

      // Verifica se já é favorito
      const existingFavorite = await prisma.favorite.findFirst({
        where: {
          userId: BigInt(req.user.userId),
          teamId: teamId
        }
      });

      if (existingFavorite) {
        res.status(409).json({ error: 'Time já está nos favoritos' });
        return;
      }

      // Adiciona aos favoritos
      const favorite = await prisma.favorite.create({
        data: {
          userId: BigInt(req.user.userId),
          teamId,
          teamName
        }
      });

      const favoriteResponse: FavoriteTeam = {
        id: favorite.id.toString(),
        userId: favorite.userId.toString(),
        teamId: favorite.teamId,
        teamName: favorite.teamName,
        createdAt: favorite.createdAt.toISOString()
      };

      res.status(201).json(favoriteResponse);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error });
        return;
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const teamIdParam = req.params.teamId;
      if (!teamIdParam) {
        res.status(400).json({ error: 'ID do time é obrigatório' });
        return;
      }
      const teamId = parseInt(teamIdParam);
      if (isNaN(teamId)) {
        res.status(400).json({ error: 'ID do time inválido' });
        return;
      }

      // Remove dos favoritos
      const deleted = await prisma.favorite.deleteMany({
        where: {
          userId: BigInt(req.user.userId),
          teamId: teamId
        }
      });

      if (deleted.count === 0) {
        res.status(404).json({ error: 'Favorito não encontrado' });
        return;
      }

      res.json({ message: 'Time removido dos favoritos' });
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async isFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const teamIdParam = req.params.teamId;
      if (!teamIdParam) {
        res.status(400).json({ error: 'ID do time é obrigatório' });
        return;
      }
      const teamId = parseInt(teamIdParam);
      if (isNaN(teamId)) {
        res.status(400).json({ error: 'ID do time inválido' });
        return;
      }

      const favorite = await prisma.favorite.findFirst({
        where: {
          userId: BigInt(req.user.userId),
          teamId: teamId
        }
      });

      res.json({ isFavorite: !!favorite });
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}