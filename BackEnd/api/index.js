// Vercel serverless function handler
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://rodadex-cvmr.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check
  if (req.url === '/api/health' || req.url === '/health') {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Backend funcionando na Vercel!'
    });
    return;
  }

  // Default response
  res.status(200).json({
    message: 'Rodadex Backend API',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}