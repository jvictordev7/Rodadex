import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../index.js';
import { generateToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import type { RegisterData, LoginData, AuthResponse, UserResponse } from '../types/index.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body) as RegisterData;
      const { name, email, password } = validatedData;

      // Verifica se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(409).json({ error: 'Email já está em uso' });
        return;
      }

      // Hash da senha
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Cria o usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          provider: 'CREDENTIALS'
        }
      });

      // Gera token JWT
      const token = generateToken({
        userId: user.id.toString(),
        email: user.email
      });

      // Resposta
      const userResponse: UserResponse = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        provider: user.provider,
        createdAt: user.createdAt.toISOString()
      };

      const response: AuthResponse = {
        user: userResponse,
        token
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error });
        return;
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body) as LoginData;
      const { email, password } = validatedData;

      // Busca o usuário
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Verifica a senha
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Gera token JWT
      const token = generateToken({
        userId: user.id.toString(),
        email: user.email
      });

      // Resposta
      const userResponse: UserResponse = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        provider: user.provider,
        createdAt: user.createdAt.toISOString()
      };

      const response: AuthResponse = {
        user: userResponse,
        token
      };

      res.json(response);
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ error: 'Dados inválidos', details: error });
        return;
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: BigInt(req.user.userId) }
      });

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const userResponse: UserResponse = {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        provider: user.provider,
        createdAt: user.createdAt.toISOString()
      };

      res.json(userResponse);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}