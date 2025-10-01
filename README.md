# ⚽ Rodadex - Plataforma de Acompanhamento Esportivo

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</div>

## 📋 Sobre o Projeto

O **Rodadex** é uma aplicação web completa desenvolvida como trabalho final da disciplina **Frameworks Web I** do curso de **Análise e Desenvolvimento de Sistemas (ADS)**. O projeto implementa uma plataforma moderna de acompanhamento esportivo, permitindo aos usuários visualizar jogos, classificações, estatísticas e gerenciar seus times favoritos.

### 🎯 Objetivos Acadêmicos

- **Aplicação Prática de Frameworks**: Implementação de uma aplicação full-stack usando as tecnologias mais modernas do mercado
- **Arquitetura Profissional**: Desenvolvimento seguindo padrões de mercado e boas práticas de software
- **Experiência Completa**: Do banco de dados ao frontend, passando por APIs, autenticação e deploy
- **Responsividade e UX**: Interface moderna, responsiva e focada na experiência do usuário

## 🏗️ Arquitetura do Sistema

```
RODADEX/
├── 🎨 Frontend/          # React + TypeScript + Vite
│   ├── 📱 Componentes     # UI Components reutilizáveis
│   ├── 📄 Páginas         # Views da aplicação
│   ├── 🎨 Estilos         # CSS modular e responsivo
│   ├── 🔧 Hooks           # Custom hooks para lógica
│   └── 🌐 Serviços        # Comunicação com APIs
│
├── ⚙️ Backend/           # Node.js + Express + Prisma
│   ├── 🛠️ Controllers     # Lógica de negócio
│   ├── 📊 Models          # Modelos de dados
│   ├── 🔐 Auth            # Sistema de autenticação
│   ├── 🌐 Routes          # Rotas da API
│   └── 📡 Services        # Integração com APIs externas
│
└── 🗄️ Database/          # SQLite + Prisma ORM
    ├── 📋 Schema          # Estrutura do banco
    ├── 🔄 Migrations      # Controle de versão do DB
    └── 🌱 Seeds           # Dados iniciais
```

## ✨ Funcionalidades Principais

### 🏠 **Dashboard Completo**
- Visualização de jogos recentes e próximos
- Interface limpa e intuitiva
- Atualizações em tempo real

### 📊 **Sistema de Classificações**
- Tabela completa do campeonato
- Estatísticas detalhadas por time
- Filtros e ordenação avançada

### ⭐ **Gerenciamento de Favoritos**
- Sistema de autenticação completo
- Adicionar/remover times favoritos
- Histórico personalizado de jogos

### 📱 **Design Responsivo**
- Layout otimizado para desktop, tablet e mobile
- Sistema de temas (claro/escuro)
- Animações e transições suaves

### 🔐 **Autenticação Segura**
- JWT tokens para segurança
- Hash de senhas com bcrypt
- Sessões persistentes

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **React Router** - Navegação SPA
- **React Query** - Estado e cache
- **CSS Modules** - Estilos modulares

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma ORM** - Object-Relational Mapping
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Git** - Controle de versão
- **VS Code** - IDE principal

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- Node.js 18+ instalado
- npm ou yarn
- Git

### **1. Clone o Repositório**
```bash
git clone https://github.com/jvictordev7/Rodadex.git
cd Rodadex
```

### **2. Configuração do Backend**
```bash
cd BackEnd
npm install
cp .env.example .env  # Configure suas variáveis
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### **3. Configuração do Frontend**
```bash
cd ../FrontEnd
npm install
cp .env.example .env  # Configure a URL da API
npm run dev
```

### **4. Acesso à Aplicação**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Banco de Dados**: Arquivo SQLite local

## 📁 Estrutura do Projeto

### **Frontend (/FrontEnd)**
```
src/
├── components/       # Componentes reutilizáveis
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks
├── context/         # Context API (Auth, Theme, Toast)
├── services/        # APIs e serviços
├── types/           # Definições TypeScript
├── utils/           # Funções utilitárias
└── assets/          # Recursos estáticos
```

### **Backend (/BackEnd)**
```
src/
├── controllers/     # Controladores
├── routes/          # Rotas da API
├── services/        # Lógica de negócio
├── middleware/      # Middlewares customizados
├── utils/           # Utilitários
└── types/           # Tipos TypeScript
```

## 🎓 Aspectos Acadêmicos

### **Conceitos Aplicados**
- **Arquitetura MVC**: Separação clara de responsabilidades
- **API RESTful**: Endpoints bem estruturados
- **Autenticação JWT**: Segurança moderna
- **Responsive Design**: Mobile-first approach
- **Component-Based Architecture**: Reutilização e manutenibilidade
- **State Management**: Context API e React Query
- **Database Design**: Modelagem relacional com Prisma

### **Boas Práticas Implementadas**
- ✅ Código TypeScript 100% tipado
- ✅ Componentização e reutilização
- ✅ Tratamento de erros robusto
- ✅ Validação de dados
- ✅ Performance otimizada
- ✅ SEO friendly
- ✅ Acessibilidade (a11y)
- ✅ Testes automatizados

## 👨‍🎓 Informações Acadêmicas

- **Curso**: Análise e Desenvolvimento de Sistemas (ADS)
- **Disciplina**: Frameworks Web I
- **Período**: 3º Período
- **Professor**: João Paulo Fernandes de Cerqueira César
- **Aluno**: João Victor
- **GitHub**: [@jvictordev7](https://github.com/jvictordev7)

## 📱 Screenshots

<div align="center">
  <h3>🏠 Dashboard Principal</h3>
  <img src="screenshots/dashboard.png" alt="Dashboard" width="800px" />
  
  <h3>📊 Tabela de Classificação</h3>
  <img src="screenshots/standings.png" alt="Classificação" width="800px" />
  
  <h3>⭐ Página de Favoritos</h3>
  <img src="screenshots/favorites.png" alt="Favoritos" width="800px" />
</div>

## 🤝 Contribuição

Este é um projeto acadêmico, mas sugestões e melhorias são sempre bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Professor João Paulo Fernandes de Cerqueira César** pela orientação e conhecimento compartilhado
- **Football API** pelos dados esportivos
- **Comunidade React** pelas ferramentas incríveis
- **Colegas de classe** pelo apoio e colaboração

---

<div align="center">
  <p>Feito com ❤️ por <a href="https://github.com/jvictordev7">João Victor</a></p>
  <p>🎓 <strong>Trabalho Final - Frameworks Web I</strong></p>
</div>
