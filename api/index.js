// Adapter para Vercel Serverless Functions
// Este arquivo importa e exporta o app Express do BackEnd

// Importa o app do BackEnd compilado
import app from '../BackEnd/dist/index.js';

// Export para Vercel
export default app;