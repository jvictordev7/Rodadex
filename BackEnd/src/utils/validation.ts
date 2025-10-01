import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(160, 'Email muito longo'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const favoriteSchema = z.object({
  teamId: z.number().int().positive('ID do time deve ser um número positivo'),
  teamName: z.string().min(1, 'Nome do time é obrigatório').max(120, 'Nome do time muito longo'),
});