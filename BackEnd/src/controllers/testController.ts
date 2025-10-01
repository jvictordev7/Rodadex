import type { Request, Response } from 'express';

export class TestController {
  static async testRoute(req: Request, res: Response): Promise<void> {
    res.json({ 
      message: 'Rota de teste funcionando!',
      timestamp: new Date().toISOString(),
      query: req.query
    });
  }
}