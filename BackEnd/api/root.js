// Root route - Welcome page
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Rodadex API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .header { text-align: center; color: #333; }
            .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
            .status { color: green; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1 class="header">🚀 Rodadex Backend API</h1>
        <p class="status">✅ Servidor funcionando na Vercel!</p>
        
        <h2>📋 Endpoints Disponíveis:</h2>
        
        <div class="endpoint">
            <strong>GET /api/health</strong><br>
            <small>Health check do servidor</small>
        </div>
        
        <div class="endpoint">
            <strong>GET /api/test</strong><br>
            <small>Teste básico da API</small>
        </div>
        
        <div class="endpoint">
            <strong>POST /api/auth/register</strong><br>
            <small>Registro de usuários</small>
        </div>
        
        <div class="endpoint">
            <strong>POST /api/auth/login</strong><br>
            <small>Login de usuários</small>
        </div>
        
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Frontend:</strong> <a href="https://rodadex-cvmr.vercel.app" target="_blank">https://rodadex-cvmr.vercel.app</a></p>
    </body>
    </html>
  `;

  return res.status(200).send(html);
}