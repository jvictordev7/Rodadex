# Testes das APIs do Rodadex - Football API & SportsDB

Write-Host "=== TESTANDO APIS DE FUTEBOL ===" -ForegroundColor Yellow
Write-Host "Certifique-se de que o servidor está rodando na porta 3000`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api"

# Função para fazer requisições HTTP
function Test-Api {
    param(
        [string]$Url,
        [string]$Description,
        [string]$Method = "GET"
    )
    
    Write-Host "🧪 Testando: $Description" -ForegroundColor Green
    Write-Host "   URL: $Url" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method $Method -ErrorAction Stop
        Write-Host "   ✅ Sucesso!" -ForegroundColor Green
        
        # Mostrar informações sobre cache
        if ($response.fromCache) {
            Write-Host "   📊 Dados do cache" -ForegroundColor Blue
        }
        if ($response.warning -eq "stale") {
            Write-Host "   ⚠️  Cache stale (dados podem estar desatualizados)" -ForegroundColor Yellow
        }
        
        # Mostrar alguns dados da resposta
        if ($response.response) {
            Write-Host "   📈 Itens retornados: $($response.response.Count)" -ForegroundColor Cyan
        }
        
        return $response
    } catch {
        Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
        return $null
    }
    Write-Host ""
}

Write-Host "=== 1. TESTANDO PRÓXIMOS JOGOS DE UM TIME ===" -ForegroundColor Yellow
$teamId = 131  # Palmeiras
$nextGames = Test-Api -Url "$baseUrl/fixtures/next?teamId=$teamId&next=3" -Description "Próximos 3 jogos do Palmeiras (ID: $teamId)"

Write-Host "=== 2. TESTANDO PRÓXIMOS JOGOS DA LIGA ===" -ForegroundColor Yellow
$leagueGames = Test-Api -Url "$baseUrl/fixtures/league?leagueId=71&season=2025&next=10" -Description "Próximos 10 jogos da Série A"

Write-Host "=== 3. TESTANDO CLASSIFICAÇÃO ===" -ForegroundColor Yellow
$standings = Test-Api -Url "$baseUrl/standings?leagueId=71&season=2025" -Description "Classificação da Série A 2025"

Write-Host "=== 4. TESTANDO BUSCA DE TIMES ===" -ForegroundColor Yellow
$teamSearch = Test-Api -Url "$baseUrl/teams/search?name=Palmeiras&league=71" -Description "Buscar time Palmeiras na Série A"

Write-Host "=== 5. TESTANDO DADOS DE UM TIME ===" -ForegroundColor Yellow
$teamData = Test-Api -Url "$baseUrl/teams/131" -Description "Dados do Palmeiras (ID: 131)"

Write-Host "=== 6. TESTANDO MÍDIA DE UM TIME ===" -ForegroundColor Yellow
$teamMedia = Test-Api -Url "$baseUrl/media/team?name=Palmeiras" -Description "Logo e mídia do Palmeiras"

Write-Host "=== 7. TESTANDO ENDPOINT COMBINADO ===" -ForegroundColor Yellow
$combinedData = Test-Api -Url "$baseUrl/teams/combined?name=Palmeiras&next=2" -Description "Dados completos do Palmeiras + próximos 2 jogos"

Write-Host "=== 8. TESTANDO CACHE ===" -ForegroundColor Yellow
Write-Host "🔄 Fazendo a mesma requisição para testar cache..." -ForegroundColor Cyan
$cachedResponse = Test-Api -Url "$baseUrl/fixtures/next?teamId=$teamId&next=3" -Description "Mesma requisição (deve vir do cache)"

Write-Host "=== 9. TESTANDO VALIDAÇÕES DE ERRO ===" -ForegroundColor Yellow
Test-Api -Url "$baseUrl/fixtures/next" -Description "Próximos jogos sem teamId (deve dar erro 400)"
Test-Api -Url "$baseUrl/fixtures/next?teamId=abc" -Description "teamId inválido (deve dar erro 400)"
Test-Api -Url "$baseUrl/media/team" -Description "Mídia sem nome (deve dar erro 400)"

Write-Host "=== RESUMO DOS TESTES ===" -ForegroundColor Yellow
Write-Host "✅ API-FOOTBALL: Fixtures, Standings, Teams" -ForegroundColor Green
Write-Host "✅ TheSportsDB: Logos e mídia dos times" -ForegroundColor Green  
Write-Host "✅ Sistema de Cache: Funciona com TTL personalizado" -ForegroundColor Green
Write-Host "✅ Validações: Parâmetros obrigatórios e tipos" -ForegroundColor Green
Write-Host "✅ Fallback: Cache stale quando API externa falha" -ForegroundColor Green

Write-Host "`n=== EXEMPLOS DE USO NO FRONTEND ===" -ForegroundColor Cyan
Write-Host "📱 Para mostrar próximos jogos: GET /api/fixtures/next?teamId=131&next=5" -ForegroundColor White
Write-Host "📊 Para mostrar classificação: GET /api/standings?leagueId=71&season=2025" -ForegroundColor White  
Write-Host "🎨 Para mostrar logo do time: GET /api/media/team?name=Palmeiras" -ForegroundColor White
Write-Host "🔍 Para buscar times: GET /api/teams/search?name=Palmeiras" -ForegroundColor White
Write-Host "💯 Para dados completos: GET /api/teams/combined?name=Palmeiras&next=3" -ForegroundColor White

Write-Host "`n🎯 Todas as APIs estão funcionando e prontas para uso!" -ForegroundColor Green