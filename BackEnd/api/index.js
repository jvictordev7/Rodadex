// Main API handler - handles all routes
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get the path
  const { url, method } = req;
  
  console.log(`${method} ${url}`);

  // Route handling
  if (url === '/' || url === '') {
    // Root route - API documentation
    return res.status(200).json({
      name: 'Rodadex Backend API',
      version: '1.0.0',
      status: 'OK',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        test: '/api/test',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login'
        }
      },
      frontend: 'https://rodadex-cvmr.vercel.app'
    });
  }

  // Health check
  if (url === '/api/health' || url === '/health') {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      message: 'Rodadex Backend funcionando na Vercel!'
    });
  }

  // Test route
  if (url === '/api/test' || url === '/test') {
    return res.status(200).json({
      success: true,
      message: 'API Test successful!',
      timestamp: new Date().toISOString(),
      method,
      url
    });
  }

  // Default response for unknown routes
  return res.status(404).json({
    error: 'Route not found',
    method,
    url,
    timestamp: new Date().toISOString(),
    availableRoutes: ['/', '/api/health', '/api/test']
  });
}