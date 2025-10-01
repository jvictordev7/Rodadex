#!/bin/bash

# 🗄️ Script de Deploy do Banco de Dados - Rodadex
# Este script configura o banco de dados em produção

echo "🚀 Iniciando deploy do banco de dados..."

# 1. Gerar cliente Prisma
echo "📦 Gerando cliente Prisma..."
npx prisma generate

# 2. Aplicar migrações
echo "🔄 Aplicando migrações..."
npx prisma db push

# 3. Verificar conexão
echo "🔍 Verificando conexão com o banco..."
npx prisma db seed --preview-feature

echo "✅ Deploy do banco concluído!"
echo "🌐 Banco pronto para produção!"