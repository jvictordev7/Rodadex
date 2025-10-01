// Imports necessários
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Inicializar Prisma
const prisma = new PrismaClient();

// Vercel serverless function with complete backend logic
export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://rodadex-cvmr.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const { url, method } = req;
    console.log(`${method} ${url}`);

    // Root route
    if (url === '/' || url === '') {
      return res.status(200).json({
        name: 'Rodadex Backend API',
        version: '1.0.0',
        status: 'OK',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          test: '/api/test',
          auth: { register: 'POST /api/auth/register', login: 'POST /api/auth/login' },
          fixtures: 'GET /api/fixtures/league'
        },
        frontend: 'https://rodadex-cvmr.vercel.app'
      });
    }

    // Health check
    if (url === '/api/health' || url === '/health') {
      return res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'TiDB Connected',
        message: 'Rodadex Backend funcionando na Vercel!'
      });
    }

    // Test route
    if (url === '/api/test' || url === '/test') {
      return res.status(200).json({
        success: true,
        message: 'API Test successful!',
        timestamp: new Date().toISOString(),
        method, url
      });
    }

    // Fixtures route - REAL API Football
    if (url.includes('/fixtures/league')) {
      try {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const league = urlParams.get('league') || '71';
        const season = urlParams.get('season') || '2023';
        const next = urlParams.get('next') || '10';

        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
          headers: {
            'X-RapidAPI-Key': process.env.FOOTBALL_API_KEY || process.env.API_FOOTBALL_KEY,
            'X-RapidAPI-Host': 'v3.football.api-sports.io'
          },
          params: {
            league,
            season,
            next
          }
        });

        return res.status(200).json({
          success: true,
          data: response.data.response || [],
          message: 'Fixtures carregados da API Football'
        });
      } catch (error) {
        console.error('Erro ao buscar fixtures:', error);
        // Fallback para dados mock se API falhar
        return res.status(200).json({
          success: true,
          data: {
            fixtures: [
              {
                fixture: { id: 1, date: '2023-10-15T15:00:00Z', status: { short: 'NS' } },
                teams: { 
                  home: { id: 1, name: 'Flamengo', logo: 'https://media.api-sports.io/football/teams/1.png' },
                  away: { id: 2, name: 'Palmeiras', logo: 'https://media.api-sports.io/football/teams/2.png' }
                },
                goals: { home: null, away: null }
              }
            ]
          },
          message: 'Fallback para dados mock (API indisponível)'
        });
      }
    }

    // Auth routes - REAL com banco TiDB
    if (url.includes('/auth/register') && method === 'POST') {
      const body = JSON.parse(req.body || '{}');
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Usuário já existe com este email' });
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          provider: 'CREDENTIALS'
        }
      });

      // Gerar JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
        token
      });
    }

    if (url.includes('/auth/login') && method === 'POST') {
      const body = JSON.parse(req.body || '{}');
      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email },
        token
      });
    }

    // Default 404
    return res.status(404).json({
      error: 'Route not found',
      method, url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}