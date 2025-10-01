# 🚀 Como Testar as APIs do Rodadex

## 📋 Pré-requisitos
1. Servidor rodando na porta 3000
2. Chave da API-Football configurada no `.env`
3. TheSportsDB configurado (ou usando chave padrão)

## 🧪 Guia de Testes

### 1. Health Check
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -Method Get"
```
**Esperado**: Status OK + timestamp

### 2. Classificação da Liga (Série A)
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/standings?leagueId=71&season=2023' -Method Get"
```
**Esperado**: Classificação completa da Série A 2023

### 3. Jogos de um Time
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/fixtures/next?teamId=131' -Method Get"
```
**Esperado**: Jogos do Palmeiras (ID: 131) na temporada 2023

### 4. Buscar Time por Nome
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/teams/search?name=Palmeiras&league=71' -Method Get"
```
**Esperado**: Dados do Palmeiras na Série A

### 5. Dados Específicos de um Time
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/teams/131' -Method Get"
```
**Esperado**: Dados completos do Palmeiras

### 6. Mídia/Logo de um Time
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/media/team?name=Palmeiras' -Method Get"
```
**Esperado**: URLs dos logos e imagens do Palmeiras

### 7. Dados Combinados (Completo)
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/teams/combined?name=Palmeiras' -Method Get"
```
**Esperado**: Time + próximos jogos + mídia em uma resposta

## 📊 Testes de Cache

### Primeira Requisição (sem cache)
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/standings?leagueId=71&season=2023' -Method Get"
```

### Segunda Requisição (do cache)
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/standings?leagueId=71&season=2023' -Method Get"
```
**Esperado**: A segunda deve retornar mais rápido e mostrar `fromCache: true`

## ⚠️ Limitações do Plano Gratuito

A API-Football no plano gratuito tem as seguintes limitações:
- ✅ Temporadas: 2021, 2022, 2023
- ❌ Parâmetro `next` não disponível
- ❌ Temporadas futuras (2024, 2025)
- ✅ 100 requisições por dia

## 🔧 IDs de Times para Teste

| Time | ID | Liga |
|------|----|----- |
| Palmeiras | 131 | 71 |
| Flamengo | 127 | 71 |
| Corinthians | 130 | 71 |
| São Paulo | 126 | 71 |
| Santos | 128 | 71 |

## 📝 Exemplos Práticos

### Buscar classificação atual:
```bash
curl "http://localhost:3000/api/standings?leagueId=71&season=2023"
```

### Buscar jogos do Flamengo:
```bash
curl "http://localhost:3000/api/fixtures/next?teamId=127"
```

### Buscar logo do Corinthians:
```bash
curl "http://localhost:3000/api/media/team?name=Corinthians"
```

## 🚨 Testes de Erro

### 1. Parâmetro obrigatório ausente:
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/fixtures/next' -Method Get"
```
**Esperado**: Erro 400 - teamId é obrigatório

### 2. ID inválido:
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/fixtures/next?teamId=abc' -Method Get"
```
**Esperado**: Erro 400 - teamId deve ser um número

### 3. Time não encontrado:
```powershell
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/media/team?name=TimeInexistente' -Method Get"
```
**Esperado**: Erro 404 - Team not found

## 🎯 Estrutura das Respostas

### Sucesso:
```json
{
  "get": "standings",
  "parameters": { "league": 71, "season": 2023 },
  "response": [...],
  "fromCache": false
}
```

### Com Cache:
```json
{
  "get": "standings", 
  "parameters": { "league": 71, "season": 2023 },
  "response": [...],
  "fromCache": true
}
```

### Com Warning (cache stale):
```json
{
  "get": "standings",
  "response": [...],
  "warning": "stale",
  "fromCache": true
}
```

## 🔍 Monitoramento

Para ver logs do servidor em tempo real:
```powershell
# Ver processos Node rodando
Get-Process | Where-Object { $_.Name -eq "node" }

# Para ver logs, rode o servidor em modo desenvolvimento:
npm run dev
```

## ✅ Checklist de Funcionamento

- [ ] Health check responde OK
- [ ] Standings retorna classificação da Série A 2023
- [ ] Fixtures retorna jogos de times
- [ ] Teams/search encontra times por nome
- [ ] Media/team retorna logos (TheSportsDB)
- [ ] Cache funciona (segunda requisição mais rápida)
- [ ] Validações de erro funcionam
- [ ] Fallback para cache stale funciona

## 🏆 Resultado Esperado

Se todos os testes passarem, você terá:
- ✅ API de futebol funcionando
- ✅ Sistema de cache implementado
- ✅ Integração com TheSportsDB
- ✅ Validações e tratamento de erros
- ✅ Fallbacks para plano gratuito
- ✅ Backend pronto para o frontend consumir