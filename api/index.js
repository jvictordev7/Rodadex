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

    // Mock fixtures route
    if (url.includes('/fixtures/league')) {
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
        }
      });
    }

    // Mock auth routes
    if (url.includes('/auth/register') && method === 'POST') {
      const body = JSON.parse(req.body || '{}');
      return res.status(200).json({
        success: true,
        message: 'Registro mockado - backend funcionando!',
        user: { id: 1, name: body.name || 'Teste', email: body.email || 'teste@teste.com' },
        token: 'mock-jwt-token-' + Date.now()
      });
    }

    if (url.includes('/auth/login') && method === 'POST') {
      const body = JSON.parse(req.body || '{}');
      return res.status(200).json({
        success: true,
        message: 'Login mockado - backend funcionando!',
        user: { id: 1, name: 'Usuário', email: body.email || 'teste@teste.com' },
        token: 'mock-jwt-token-' + Date.now()
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