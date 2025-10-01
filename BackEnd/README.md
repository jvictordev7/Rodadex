# ⚙️ Rodadex Backend

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
</div>

## 📋 Sobre o Backend

O backend do **Rodadex** é uma API REST robusta e escalável, construída com **Node.js** e **TypeScript**. Implementa arquitetura moderna com **Prisma ORM**, sistema de autenticação **JWT**, e integração com **APIs externas** de futebol, oferecendo uma base sólida para o frontend consumir dados esportivos em tempo real.

## 🚀 Stack Tecnológica

### **Runtime e Linguagem**
- **Node.js 20+** - Runtime JavaScript moderno e performático
- **TypeScript 5.7** - Tipagem estática para JavaScript
- **ES2022** - Features modernas do ECMAScript

### **Framework e Servidor**
- **Express.js 4.21** - Framework web minimalista e flexível
- **CORS** - Cross-Origin Resource Sharing configurado
- **Helmet** - Segurança com headers HTTP
- **Compression** - Compressão gzip das respostas

### **Banco de Dados e ORM**
- **SQLite** - Banco de dados leve e eficiente para desenvolvimento
- **Prisma ORM 6.2** - Object-Relational Mapping moderno
- **Prisma Client** - Cliente type-safe para queries
- **Prisma Migrate** - Sistema de migrações versionadas

### **Autenticação e Segurança**
- **JWT (jsonwebtoken)** - JSON Web Tokens para autenticação
- **bcrypt** - Hash seguro de senhas com salt
- **Rate Limiting** - Proteção contra ataques de força bruta
- **Input Validation** - Validação robusta de dados de entrada

### **APIs Externas e Integração**
- **Axios** - Cliente HTTP para requisições externas
- **Football API** - Integração com dados esportivos em tempo real
- **API Rate Limiting** - Controle de requisições às APIs externas

## 🏗️ Arquitetura do Backend

```
src/
├── 🛠️ controllers/          # Controladores da aplicação
│   ├── AuthController.ts    # Autenticação e autorização
│   ├── UserController.ts    # Gerenciamento de usuários
│   ├── FavoriteController.ts # Sistema de favoritos
│   └── FootballController.ts # Dados esportivos
│
├── 🔌 routes/              # Definição de rotas
│   ├── auth.ts             # Rotas de autenticação
│   ├── users.ts            # Rotas de usuários
│   ├── favorites.ts        # Rotas de favoritos
│   └── football.ts         # Rotas de dados esportivos
│
├── 🛡️ middleware/          # Middlewares customizados
│   ├── auth.ts             # Middleware de autenticação
│   ├── validation.ts       # Validação de dados
│   ├── rateLimiter.ts      # Limitação de taxa
│   └── errorHandler.ts     # Tratamento de erros
│
├── 🌐 services/            # Lógica de negócio
│   ├── AuthService.ts      # Serviços de autenticação
│   ├── UserService.ts      # Serviços de usuário
│   ├── FootballService.ts  # Integração com APIs externas
│   └── DatabaseService.ts  # Operações de banco
│
├── 📊 models/              # Modelos de dados (Prisma)
│   └── schema.prisma       # Schema do banco de dados
│
├── 🔧 utils/               # Utilitários
│   ├── jwt.ts              # Utilidades JWT
│   ├── password.ts         # Hash de senhas
│   ├── validators.ts       # Validadores customizados
│   └── constants.ts        # Constantes da aplicação
│
├── 📝 types/               # Definições TypeScript
│   ├── auth.ts             # Tipos de autenticação
│   ├── user.ts             # Tipos de usuário
│   └── football.ts         # Tipos de dados esportivos
│
└── 🗄️ prisma/              # Configuração Prisma
    ├── schema.prisma       # Schema principal
    ├── migrations/         # Migrações do banco
    └── seed.ts             # Dados iniciais
```

## 🛠️ Principais Funcionalidades

### 🔐 **Sistema de Autenticação Completo**
```typescript
// JWT Authentication
POST /api/auth/login     # Login de usuário
POST /api/auth/register  # Cadastro de usuário  
POST /api/auth/refresh   # Renovação de token
POST /api/auth/logout    # Logout seguro
```

### 👤 **Gerenciamento de Usuários**
```typescript
// User Management
GET    /api/users/profile    # Perfil do usuário
PUT    /api/users/profile    # Atualizar perfil
DELETE /api/users/account    # Excluir conta
GET    /api/users/favorites  # Listar favoritos
```

### ⭐ **Sistema de Favoritos**
```typescript
// Favorites System
GET    /api/favorites           # Listar favoritos
POST   /api/favorites          # Adicionar favorito
DELETE /api/favorites/:teamId  # Remover favorito
GET    /api/favorites/history  # Histórico de jogos favoritos
```

### ⚽ **Dados Esportivos**
```typescript
// Football Data
GET /api/football/fixtures    # Partidas
GET /api/football/standings   # Classificações
GET /api/football/teams       # Times
GET /api/football/team/:id    # Detalhes do time
```

## 🗄️ Modelagem do Banco de Dados

### **Schema Prisma**
```prisma
// User Model
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  password  String
  provider  String    @default("local")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  favorites Favorite[]
}

// Favorite Model  
model Favorite {
  id       Int    @id @default(autoincrement())
  userId   Int
  teamId   Int
  teamName String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, teamId])
}
```

### **Relacionamentos**
- **User → Favorites**: Um usuário pode ter muitos favoritos (1:N)
- **Cascade Delete**: Favoritos são removidos quando usuário é excluído
- **Unique Constraint**: Um usuário não pode favoritar o mesmo time duas vezes

## 🔧 Middlewares Implementados

### **Autenticação JWT**
```typescript
// JWT Middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### **Validação de Dados**
```typescript
// Validation Middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Dados inválidos', details: error });
    }
  };
};
```

### **Rate Limiting**
```typescript
// Rate Limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: 'Muitas requisições. Tente novamente em 15 minutos.'
});
```

## 🌐 Integração com APIs Externas

### **Football API Service**
```typescript
class FootballService {
  private readonly apiClient: AxiosInstance;
  
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.FOOTBALL_API_URL,
      headers: {
        'X-API-Key': process.env.FOOTBALL_API_KEY
      }
    });
  }
  
  async getFixtures(): Promise<Fixture[]> {
    const response = await this.apiClient.get('/fixtures');
    return response.data;
  }
  
  async getStandings(): Promise<Standing[]> {
    const response = await this.apiClient.get('/standings');
    return response.data;
  }
}
```

## 🔒 Segurança Implementada

### **Hash de Senhas**
```typescript
// Password Hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

### **JWT Configuration**
```typescript
// JWT Utils
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h',
    issuer: 'rodadex-api',
    audience: 'rodadex-frontend'
  });
};
```

### **Headers de Segurança**
```typescript
// Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento com nodemon
npm run build           # Build de produção
npm run start           # Iniciar servidor de produção

# Banco de Dados
npm run db:migrate      # Executar migrações
npm run db:seed         # Popular banco com dados iniciais
npm run db:reset        # Reset completo do banco
npm run db:studio       # Interface visual do Prisma Studio

# Qualidade de Código
npm run lint            # Análise de código com ESLint
npm run type-check      # Verificação de tipos TypeScript
npm run test            # Executar testes

# Utilitários
npm run clean           # Limpar build/cache
npm run api:test        # Testar endpoints da API
```

## 🔧 Configuração do Ambiente

### **Variáveis de Ambiente (.env)**
```bash
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
JWT_EXPIRES_IN=24h

# APIs Externas
FOOTBALL_API_URL=https://api.football-data.org/v4
FOOTBALL_API_KEY=sua_api_key_aqui

# Frontend
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📦 Dependências Principais

### **Produção**
```json
{
  "express": "^4.21.2",
  "prisma": "^6.2.1",
  "@prisma/client": "^6.2.1",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "axios": "^1.7.9",
  "cors": "^2.8.5",
  "helmet": "^8.0.0",
  "express-rate-limit": "^7.4.1"
}
```

### **Desenvolvimento**
```json
{
  "typescript": "^5.7.2",
  "nodemon": "^3.1.9",
  "@types/node": "^22.10.2",
  "@types/express": "^5.0.0",
  "@types/bcrypt": "^5.0.2",
  "@types/jsonwebtoken": "^9.0.7"
}
```

## 🚀 Deployment

### **Build de Produção**
```bash
# Build da aplicação
npm run build

# Executar migrações em produção
npm run db:migrate

# Iniciar servidor
npm start
```

### **Docker Support**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## 📈 Performance e Monitoramento

### **Logging**
```typescript
// Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### **Health Check**
```typescript
// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

## 🧪 Testes

### **Estrutura de Testes**
```
tests/
├── unit/              # Testes unitários
├── integration/       # Testes de integração
├── e2e/              # Testes end-to-end
└── fixtures/         # Dados de teste
```

### **Exemplo de Teste**
```typescript
describe('AuthController', () => {
  test('deve fazer login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

## 🔍 API Documentation

### **Swagger/OpenAPI**
A documentação completa da API está disponível em `/api/docs` quando o servidor está rodando.

### **Postman Collection**
Uma collection do Postman com todos os endpoints está disponível no arquivo `api-test.http`.

---

<div align="center">
  <p>⚙️ <strong>Backend robusto e escalável</strong></p>
  <p>Desenvolvido por <a href="https://github.com/jvictordev7">João Victor</a></p>
</div>

