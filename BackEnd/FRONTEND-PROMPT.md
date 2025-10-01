# 🚀 Prompt para Frontend Rodadex - React + TypeScript

## 📋 Contexto
Preciso criar o frontend React para consumir as APIs do backend Rodadex já implementado. O backend está rodando em `http://localhost:3000` com as seguintes rotas funcionando:

### 🔗 APIs Disponíveis:
- **Autenticação**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Favoritos**: `/api/favorites` (GET, POST, DELETE)
- **Futebol**: `/api/standings`, `/api/fixtures/next`, `/api/teams/search`, `/api/media/team`, `/api/teams/combined`

## 🎯 Especificações do Frontend

### Stack Tecnológica:
- React 18 + Vite + TypeScript
- React Router DOM para roteamento
- React Query (TanStack Query) para cache e requisições
- Axios para HTTP requests
- Material-UI ou Styled Components para UI
- Context API para autenticação global

### 🏗️ Estrutura de Pastas:
```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Header, Footer, Loading, etc.
│   ├── auth/           # Login, Register forms
│   └── football/       # Cards de times, jogos, etc.
├── pages/              # Páginas principais
│   ├── Home.tsx        # Próximos jogos
│   ├── Standings.tsx   # Classificação
│   ├── Team.tsx        # Detalhes do time
│   ├── Favorites.tsx   # Times favoritos (protegida)
│   ├── Login.tsx       # Login
│   └── Register.tsx    # Cadastro
├── hooks/              # Custom hooks
├── services/           # API calls
├── contexts/           # Context providers
├── types/              # TypeScript types
└── utils/              # Utilitários
```

### 🔧 Implementações Necessárias:

#### 1. Service Layer (API calls):
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Football services
export const footballService = {
  getStandings: (leagueId = 71, season = 2023) => 
    api.get(`/standings?leagueId=${leagueId}&season=${season}`),
  getTeamFixtures: (teamId) => 
    api.get(`/fixtures/next?teamId=${teamId}`),
  searchTeams: (name) => 
    api.get(`/teams/search?name=${name}`),
  getTeamMedia: (name) => 
    api.get(`/media/team?name=${name}`),
  getTeamCombined: (name) => 
    api.get(`/teams/combined?name=${name}`),
};

// Favorites services
export const favoritesService = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (data) => api.post('/favorites', data),
  removeFavorite: (teamId) => api.delete(`/favorites/${teamId}`),
  checkFavorite: (teamId) => api.get(`/favorites/${teamId}/check`),
};
```

#### 2. Context de Autenticação:
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Implementar login, register, logout
  // Verificar token no localStorage
  // Fazer chamada para /auth/me na inicialização
};
```

#### 3. React Query Hooks:
```typescript
// hooks/useFootball.ts
export const useStandings = () => {
  return useQuery({
    queryKey: ['standings', 71, 2023],
    queryFn: () => footballService.getStandings(71, 2023),
    staleTime: 30 * 60 * 1000, // 30 min
  });
};

export const useTeamFixtures = (teamId: number) => {
  return useQuery({
    queryKey: ['fixtures', teamId],
    queryFn: () => footballService.getTeamFixtures(teamId),
    enabled: !!teamId,
    staleTime: 15 * 60 * 1000, // 15 min
  });
};

// hooks/useFavorites.ts
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesService.getFavorites,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoritesService.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
```

#### 4. Componentes Principais:

**Home Page** - Próximos jogos da Série A:
- Usar `useQuery` para buscar `/api/fixtures/league?leagueId=71&season=2023`
- Exibir cards dos jogos com times, data, horário
- Botão para favoritar times (se logado)

**Standings Page** - Classificação:
- Usar hook `useStandings()`
- Tabela responsiva com posição, time, pontos, jogos
- Links para página individual do time

**Team Page** - Detalhes do time:
- Usar `useTeamCombined(teamName)` para dados completos
- Mostrar logo, estatísticas, próximos jogos
- Botão favoritar/desfavoritar

**Favorites Page** (protegida):
- Usar `useFavorites()` hook
- Lista dos times favoritos do usuário
- Próximos jogos de cada time favorito

#### 5. Roteamento:
```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/standings" element={<Standings />} />
    <Route path="/team/:name" element={<Team />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route 
      path="/favorites" 
      element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } 
    />
  </Routes>
</BrowserRouter>
```

#### 6. Tipos TypeScript:
```typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  teamId: number;
  teamName: string;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  logo?: string;
  country?: string;
}

export interface Match {
  fixture: {
    id: number;
    date: string;
    status: { short: string; long: string };
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}
```

### 🎨 UI/UX Requirements:
- Design responsivo (mobile-first)
- Loading states em todas as requisições
- Error boundaries e tratamento de erros
- Feedback visual para ações (favoritar, login, etc.)
- Header com navegação e status de login
- Tema dark/light (opcional)

### 🔒 Funcionalidades de Autenticação:
- Formulários de login/registro com validação
- Persistência do token no localStorage
- Redirect após login/logout
- Rotas protegidas que requerem autenticação
- Estado global do usuário logado

### 📱 Funcionalidades de Futebol:
- Cards de jogos com data/hora formatada
- Tabela de classificação ordenável
- Busca de times por nome
- Sistema de favoritos com feedback visual
- Exibição de logos dos times (TheSportsDB)
- Cache inteligente com React Query

## 🚀 Comandos para Inicializar:
```bash
npm create vite@latest rodadex-frontend -- --template react-ts
cd rodadex-frontend
npm install @tanstack/react-query axios react-router-dom @mui/material @emotion/react @emotion/styled
npm run dev
```

## 🎯 Critérios de Sucesso:
1. ✅ Todas as APIs do backend consumidas corretamente
2. ✅ Sistema de autenticação funcional
3. ✅ Cache otimizado com React Query
4. ✅ Interface responsiva e intuitiva
5. ✅ Tratamento completo de erros e loading
6. ✅ Código tipado e bem estruturado

**Gere um frontend React completo seguindo essas especificações, focando na integração correta com as APIs já implementadas no backend.**