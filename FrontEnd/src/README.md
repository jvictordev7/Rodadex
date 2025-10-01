# 🏆 Rodadex - Frontend

**Rodadex** é uma aplicação web completa para acompanhar o Campeonato Brasileiro Série A 2025. Desenvolvida com React + TypeScript + Vite, oferece funcionalidades como visualização de jogos, classificação da liga, sistema de favoritos e autenticação de usuários.

## 🎯 Objetivo

Este projeto foi desenvolvido como trabalho final da disciplina **Frameworks Web I**, demonstrando conhecimentos em:
- ⚛️ React com Hooks
- 🔄 Gerenciamento de estado
- 🌐 Consumo de APIs REST
- 🛣️ Roteamento com React Router
- 🎨 Componentização reutilizável
- 📱 Design responsivo
- 🔐 Autenticação JWT

## 🚀 Funcionalidades

### 📋 Funcionalidades Públicas
- **Home**: Próximos jogos do Brasileirão com filtros (ao vivo, finalizados, etc.)
- **Classificação**: Tabela completa da Série A com posições e estatísticas
- **Páginas responsivas** com design profissional

### 🔐 Funcionalidades Autenticadas
- **Login/Cadastro**: Sistema completo de autenticação
- **Favoritos**: Salvar e gerenciar times favoritos
- **Rotas protegidas**: Acesso controlado por JWT

### 🎨 Recursos Técnicos
- **Loading states** e **Error handling** em todas as requisições
- **Cache inteligente** com React Query
- **Filtros dinâmicos** em tempo real
- **Validação de formulários** robusta
- **Feedback visual** para todas as ações

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript, Vite
- **Roteamento**: React Router DOM
- **Estado/Cache**: TanStack React Query
- **HTTP**: Axios
- **Estilização**: CSS Modules (profissional)
- **Autenticação**: JWT + Context API

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passo a passo

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd rodadex-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Renomeie .env.example para .env e configure:
VITE_API_URL=http://localhost:3001
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header/         # Cabeçalho com navegação
│   ├── Loading/        # Indicador de carregamento
│   ├── ErrorMessage/   # Tratamento de erros
│   ├── MatchCard/      # Card de jogos
│   └── StandingsTable/ # Tabela de classificação
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── Standings.tsx   # Classificação
│   ├── Login.tsx       # Autenticação
│   ├── Register.tsx    # Cadastro
│   └── Favorites.tsx   # Favoritos (protegida)
├── context/            # Context API
│   └── AuthContext.tsx # Gerenciamento de autenticação
├── hooks/              # Custom hooks
│   └── useApi.ts       # Hooks para API calls
├── services/           # Configuração de APIs
│   └── api.ts          # Configuração Axios + endpoints
├── types/              # TypeScript definitions
│   └── index.ts        # Interfaces e tipos
├── utils/              # Funções utilitárias
│   └── index.ts        # Helpers e formatação
└── styles/             # Estilos globais
```

## 🎨 Design System

### Cores Principais
```css
--primary: #1e3c72    /* Azul principal */
--secondary: #2a5298  /* Azul secundário */
--success: #28a745    /* Verde */
--warning: #ffa500    /* Laranja */
--danger: #e53e3e     /* Vermelho */
--gray: #f7fafc       /* Cinza claro */
```

### Componentes
- **Header**: Navegação responsiva com autenticação
- **Cards**: Sistema modular para jogos e favoritos  
- **Tabelas**: Classificação com cores por posição
- **Forms**: Validação e feedback em tempo real
- **Loading**: Estados de carregamento elegantes

## 🔗 API Integration

### Endpoints Utilizados
- `GET /fixtures/league` - Jogos da liga
- `GET /standings` - Classificação
- `POST /auth/login` - Autenticação
- `POST /auth/register` - Cadastro
- `GET /favorites` - Favoritos do usuário
- `POST /favorites` - Adicionar favorito
- `DELETE /favorites/:id` - Remover favorito

### Cache Strategy
- **Fixtures**: 15 minutos (5 min em rodadas)
- **Standings**: 30 minutos (15 min em rodadas)
- **User data**: Sessão
- **Teams**: 1 dia

## 📱 Responsividade

- **Desktop**: Layout completo com sidebar
- **Tablet**: Adaptação de grid e navegação
- **Mobile**: Design mobile-first otimizado

## 🧪 Testes e Qualidade

- **TypeScript**: Tipagem completa
- **Error Boundaries**: Tratamento de erros robusto
- **Loading States**: Feedback visual consistente
- **Form Validation**: Validação client-side
- **Accessibility**: Padrões WCAG básicos

## 👥 Integrantes

- **[Seu Nome]** - Desenvolvedor Full Stack
- **[Nome 2]** - [Função]
- **[Nome 3]** - [Função]
- **[Nome 4]** - [Função]

## 🌐 Links

- **🔗 Aplicação**: [https://rodadex.vercel.app](https://rodadex.vercel.app)
- **📂 Repositório**: [https://github.com/usuario/rodadex](https://github.com/usuario/rodadex)
- **🎮 CodeSandbox**: [https://codesandbox.io/p/rodadex](https://codesandbox.io/p/rodadex)
- **🎥 Vídeo Demo**: [https://youtube.com/watch?v=demo](https://youtube.com/watch?v=demo)

## 📋 Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Linting do código
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório GitHub na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras opções
- Netlify
- GitHub Pages
- Firebase Hosting

## 🎯 Critérios Atendidos

✅ **Componentização**: Estrutura modular reutilizável  
✅ **Hooks**: useState, useEffect, custom hooks  
✅ **API Consumption**: Axios + React Query  
✅ **Routing**: React Router DOM  
✅ **Authentication**: JWT + Protected Routes  
✅ **Responsive Design**: Mobile-first  
✅ **Error Handling**: Estados de erro elegantes  
✅ **Loading States**: Feedback visual consistente  
✅ **TypeScript**: Tipagem completa  
✅ **Professional Design**: UI/UX moderna  

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do curso de Frameworks Web I.

---

**Feito com ❤️ e ⚽ para o Brasileirão 2025**