// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://rodadex-cvmr.vercel.app',
  process.env.FRONTEND_URL
].filter(origin => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando na Vercel!' });
});

// For Vercel serverless
module.exports = app;