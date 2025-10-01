import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import favoriteRoutes from './routes/favorites.js';
// import footballRoutes from './routes/football.js'; // Removido - substituído por apiFootballRoutes
import apiFootballRoutes from './routes/apiFootball.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Inicializa o Prisma Client
export const prisma = new PrismaClient();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://rodadex-cvmr.vercel.app',
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api', apiFootballRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Rodadex Backend API funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Rodadex Backend API funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Tratamento graceful do shutdown
process.on('SIGINT', async () => {
  console.log('Recebido SIGINT. Fechando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Recebido SIGTERM. Fechando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📊 Health check disponível em http://localhost:${port}/api/health`);
  });
}

// Export para Vercel
export default app;