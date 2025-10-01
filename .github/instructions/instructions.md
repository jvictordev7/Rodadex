---
applyTo: '**'
---

# Instructions – Projeto Rodadex

## Objetivo

Construir uma aplicação completa de futebol chamada Rodadex, que exibe dados do Campeonato Brasileiro Série A:

- Próximos jogos (fixtures).
- Classificação da liga.
- Detalhes de times.
- Sistema de login e favoritos.

## Tecnologias

### Frontend
- React 18 (Vite + TypeScript).
- React Router DOM (rotas).
- React Query (cache de dados da API no cliente).
- Axios (requisições).
- Estilização: Material-UI ou Styled Components.

### Backend
- Node.js + Express.
- Prisma ORM com MySQL.
- Autenticação com JWT.
- bcrypt para hash de senhas.
- axios para consumo da API-FOOTBALL.
- Cache com Redis (ou em memória).
- Zod para validação de dados.

### APIs
- API-FOOTBALL: jogos, standings e times.
- TheSportsDB: logos e imagens.

### Infraestrutura
- Vercel → frontend.
- Render / Railway / Fly.io → backend.
- PlanetScale / Railway → banco MySQL.
- GitHub → versionamento.

## Funcionalidades

### Públicas
- Home: próximos jogos do Brasileirão.
- Classificação: tabela da Série A.
- Página de time: elenco + últimos/próximos jogos.

### Autenticadas
- Cadastro/Login com email + senha (JWT).
- Rota protegida /favoritos.
- Usuário pode salvar/remover times favoritos.

## Banco de Dados (MySQL + Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id           BigInt    @id @default(autoincrement())
  name         String
  email        String    @unique
  passwordHash String
  provider     String    @default("credentials")
  createdAt    DateTime  @default(now())
  favorites    Favorite[]
}

model Favorite {
  id        BigInt   @id @default(autoincrement())
  userId    BigInt
  teamId    Int
  teamName  String
  createdAt DateTime @default(now())

  user      User @relation(fields: [userId], references: [id])

  @@unique([userId, teamId])
}
```

## Rotas Backend

### Autenticação
- `POST /auth/register` → cria usuário.
- `POST /auth/login` → retorna JWT.
- `GET /auth/me` → retorna dados do usuário logado.

### Favoritos (protegidas)
- `GET /favorites` → lista favoritos do usuário.
- `POST /favorites` → adiciona favorito.
- `DELETE /favorites/:teamId` → remove favorito.

### Futebol
- `GET /fixtures/next?teamId=xxx&next=1` → próximos jogos de um time.
- `GET /fixtures/league?leagueId=71&season=2025` → próximos jogos da Série A.
- `GET /standings?leagueId=71&season=2025` → classificação da Série A.
- `GET /teams/:id` → dados do time (opcional).

## Cache
- Fixtures → TTL 15 min (em rodadas: 5 min).
- Standings → TTL 30 min (em rodadas: 15 min).
- Times/imagens → TTL 1–7 dias.

## Boas Práticas
- Usar useState e useEffect para estados locais.
- Requisições via hooks (useQuery).
- Componentização (Cards, Loaders, ErrorStates).
- Tratamento de erro e loading em todas as chamadas.
- Código tipado (TypeScript).

## Exemplos de Queries Prisma

### Criar usuário (registro)
```typescript
import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";

async function registerUser(name: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, passwordHash }
  });
}
```

### Buscar usuário por email (login)
```typescript
async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}
```

### Buscar usuário + favoritos
```typescript
async function getUserWithFavorites(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { favorites: true }
  });
}
```

### Adicionar favorito (time)
```typescript
async function addFavorite(userId: number, teamId: number, teamName: string) {
  return prisma.favorite.upsert({
    where: { userId_teamId: { userId, teamId } },
    update: {},
    create: { userId, teamId, teamName }
  });
}
```

### Remover favorito
```typescript
async function removeFavorite(userId: number, teamId: number) {
  return prisma.favorite.delete({
    where: { userId_teamId: { userId, teamId } }
  });
}
```