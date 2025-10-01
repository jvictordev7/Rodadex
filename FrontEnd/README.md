# 🎨 Rodadex Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</div>

## 📋 Sobre o Frontend

O frontend do **Rodadex** é uma aplicação React moderna construída com as melhores práticas e tecnologias mais atuais do mercado. Desenvolvido com foco em **performance**, **usabilidade** e **responsividade**, oferece uma experiência completa de acompanhamento esportivo.

## 🚀 Tecnologias Principais

### **Core Framework**
- **React 19.1.1** - Framework JavaScript mais popular do mundo
- **TypeScript 5.7** - Tipagem estática para JavaScript
- **Vite 7.1** - Build tool moderna e extremamente rápida

### **Roteamento e Navegação**
- **React Router DOM 6.28** - Roteamento declarativo para React
- **Navegação SPA** - Single Page Application fluida
- **Lazy Loading** - Carregamento otimizado de componentes

### **Gerenciamento de Estado**
- **React Query 5.61** - Data fetching e cache inteligente
- **Context API** - Estado global para Auth, Theme e Toast
- **Custom Hooks** - Lógica reutilizável e encapsulada

### **Estilização e UI**
- **CSS Modules** - Estilos modulares e encapsulados
- **CSS Custom Properties** - Variáveis CSS nativas
- **Responsive Design** - Mobile-first approach
- **Sistema de Temas** - Light/Dark mode completo

## 🏗️ Arquitetura do Frontend

```
src/
├── 📱 components/           # Componentes reutilizáveis
│   ├── Header/             # Cabeçalho com navegação
│   ├── Loading/            # Estados de carregamento
│   ├── ErrorMessage/       # Tratamento de erros
│   ├── MatchCard/          # Card de partidas
│   ├── StandingsTable/     # Tabela de classificação
│   ├── Skeleton/           # Loading skeletons
│   └── ThemeToggle/        # Toggle de tema
│
├── 📄 pages/               # Páginas da aplicação
│   ├── Home.tsx            # Dashboard principal
│   ├── Standings.tsx       # Classificações
│   ├── Favorites.tsx       # Times favoritos
│   ├── TeamDetails.tsx     # Detalhes do time
│   ├── Login.tsx           # Autenticação
│   └── Register.tsx        # Cadastro
│
├── 🔧 hooks/               # Custom Hooks
│   ├── useApi.ts           # Hooks para APIs
│   ├── useAuth.ts          # Hook de autenticação
│   └── useLocalStorage.ts  # Persistência local
│
├── 🌐 context/             # Context Providers
│   ├── AuthContext.tsx     # Contexto de autenticação
│   ├── ThemeContext.tsx    # Contexto de tema
│   └── ToastContext.tsx    # Contexto de notificações
│
├── 🔌 services/            # Serviços e APIs
│   ├── api.ts              # Cliente HTTP (Axios)
│   ├── auth.ts             # Serviços de auth
│   └── football.ts         # APIs de futebol
│
├── 🎨 styles/              # Estilos globais
│   ├── globals.css         # Reset e variáveis
│   ├── themes.css          # Sistema de temas
│   └── responsive.css      # Media queries
│
├── 📝 types/               # Definições TypeScript
│   └── index.ts            # Interfaces e tipos
│
└── 🛠️ utils/               # Funções utilitárias
    ├── formatters.ts       # Formatação de dados
    ├── validators.ts       # Validações
    └── constants.ts        # Constantes
```

## ✨ Funcionalidades do Frontend

### 🏠 **Dashboard Interativo**
- Lista de partidas em tempo real
- Design cards modernos e responsivos
- Informações detalhadas de cada jogo
- Loading states elegantes

### 📊 **Classificações Dinâmicas**
- Tabela interativa e responsiva
- Cores indicativas de posições (Champions, Europa, Rebaixamento)
- Clique nos times para ver detalhes
- Ordenação e filtros

### ⭐ **Sistema de Favoritos**
- Adicionar/remover times favoritos
- Histórico personalizado de jogos
- Interface intuitiva e responsiva
- Persistência de dados

### 🎨 **Sistema de Temas**
- **Light Mode**: Design limpo e moderno
- **Dark Mode**: Interface elegante para uso noturno
- Transições suaves entre temas
- Persistência da preferência do usuário

### 📱 **Design Responsivo**
```css
/* Breakpoints utilizados */
Mobile:     0px - 767px     (Mobile-first)
Tablet:     768px - 1023px  (Layout adaptado)
Desktop:    1024px+         (Layout completo)
```

### 🔔 **Sistema de Notificações**
- Toast notifications elegantes
- Diferentes tipos: sucesso, erro, aviso, info
- Auto-dismiss configurável
- Posicionamento otimizado

## 🛠️ Ferramentas de Desenvolvimento

### **Build e Development**
- **Vite** - Dev server ultra-rápido
- **Hot Module Replacement** - Atualizações instantâneas
- **Tree Shaking** - Bundle otimizado
- **Code Splitting** - Carregamento sob demanda

### **Linting e Formatação**
- **ESLint** - Análise estática de código
- **TypeScript Compiler** - Verificação de tipos
- **Prettier** (via ESLint) - Formatação automática

### **Performance**
- **React.memo** - Otimização de re-renders
- **useMemo/useCallback** - Memoização inteligente
- **Lazy Loading** - Componentes sob demanda
- **Image Optimization** - Carregamento otimizado

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build de produção
npm run preview         # Preview do build

# Qualidade de Código
npm run lint            # Análise de código
npm run type-check      # Verificação TypeScript

# Testes
npm run test            # Executa testes
npm run test:watch      # Testes em watch mode
```

## 📦 Dependências Principais

### **Produção**
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^6.28.0",
  "@tanstack/react-query": "^5.61.0",
  "axios": "^1.7.9"
}
```

### **Desenvolvimento**
```json
{
  "@vitejs/plugin-react": "^4.3.4",
  "typescript": "~5.7.2",
  "vite": "^7.1.7",
  "eslint": "^9.17.0"
}
```

## 🎨 Padrões de Design

### **Componentes**
```typescript
// Estrutura padrão de componente
interface ComponentProps {
  // Props tipadas
}

const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Lógica do componente
  
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### **Custom Hooks**
```typescript
// Hook personalizado
export const useCustomHook = () => {
  const [state, setState] = useState();
  
  // Lógica reutilizável
  
  return { state, actions };
};
```

### **Estilos CSS**
```css
/* Mobile-first approach */
.component {
  /* Estilos base (mobile) */
}

@media (min-width: 768px) {
  .component {
    /* Tablet */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop */
  }
}
```

## 🔧 Configuração do Ambiente

### **Variáveis de Ambiente**
```bash
# .env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Rodadex
VITE_APP_VERSION=1.0.0
```

### **Configuração do Vite**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## 📱 Responsividade

### **Breakpoints Utilizados**
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

### **Estratégias de Layout**
- **Flexbox** para layouts dinâmicos
- **CSS Grid** para layouts complexos
- **Container Queries** quando necessário
- **Viewport Units** para layouts fluidos

## 🚀 Performance

### **Métricas Otimizadas**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **Técnicas Aplicadas**
- Code splitting por rota
- Lazy loading de componentes
- Memoização inteligente
- Bundle size otimizado

## 🤝 Padrões de Contribuição

### **Commit Messages**
```
feat: adiciona nova funcionalidade
fix: corrige bug específico
style: ajustes de estilo
refactor: refatoração de código
docs: atualização de documentação
```

### **Branch Strategy**
- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções

---

<div align="center">
  <p>🎨 <strong>Frontend construído com as melhores práticas modernas</strong></p>
  <p>Desenvolvido por <a href="https://github.com/jvictordev7">João Victor</a></p>
</div>
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
