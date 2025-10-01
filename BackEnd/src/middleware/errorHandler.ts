import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erro capturado:', error);

  // Erro de validação do Zod
  if (error.name === 'ZodError') {
    res.status(400).json({
      error: 'Dados inválidos',
      details: error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
    return;
  }

  // Erro do Prisma
  if (error.code === 'P2002') {
    res.status(409).json({
      error: 'Dados já existem',
      message: 'Este email já está cadastrado',
    });
    return;
  }

  // Erro personalizado
  if (error.status) {
    res.status(error.status).json({
      error: error.message || 'Erro interno do servidor',
    });
    return;
  }

  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};