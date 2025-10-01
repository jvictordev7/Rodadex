import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://rodadex-cvmr.vercel.app',
  process.env.FRONTEND_URL
].filter((origin) => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Rodadex Backend API funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Rodadex Backend API funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Football API routes
app.get('/api/standings', async (req, res) => {
  try {
    const { leagueId = process.env.LEAGUE_SERIE_A, season = process.env.SEASON } = req.query;
    
    const response = await axios.get(`${process.env.FOOTBALL_API_BASE}/standings`, {
      headers: {
        'X-RapidAPI-Host': 'v3.football.api-sports.io',
        'X-RapidAPI-Key': process.env.FOOTBALL_API_KEY
      },
      params: {
        league: leagueId,
        season: season
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    res.status(500).json({ error: 'Erro ao buscar classificação' });
  }
});

app.get('/api/teams/search', async (req, res) => {
  try {
    const { name, league = process.env.LEAGUE_SERIE_A } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome do time é obrigatório' });
    }
    
    const response = await axios.get(`${process.env.FOOTBALL_API_BASE}/teams`, {
      headers: {
        'X-RapidAPI-Host': 'v3.football.api-sports.io',
        'X-RapidAPI-Key': process.env.FOOTBALL_API_KEY
      },
      params: {
        name: name,
        league: league
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar time:', error);
    res.status(500).json({ error: 'Erro ao buscar time' });
  }
});

// Export para Vercel
export default app;