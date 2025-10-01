import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites, useLeagueFixtures, useStandings } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import type { Favorite } from '../types';
import './FavoritesHistory.css';

const FavoritesHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();
  const { data: fixtures, isLoading: fixturesLoading } = useLeagueFixtures();
  const { data: standings } = useStandings();

  // Verificar autenticação
  if (!isAuthenticated || !user) {
    return (
      <div className="favorites-history">
        <div className="auth-required">
          <h2>🔐 Login Necessário</h2>
          <p>Você precisa estar logado para ver o histórico dos seus favoritos.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="btn-primary"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (favoritesLoading || fixturesLoading) {
    return (
      <div className="favorites-history">
        <div className="loading-container">
          <div className="loading-spinner">⚽</div>
          <h3>Carregando histórico dos favoritos...</h3>
        </div>
      </div>
    );
  }

  // Sem favoritos
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-history">
        <div className="no-favorites">
          <h2>⭐ Nenhum Favorito</h2>
          <p>Você ainda não tem times favoritos. Vá para a classificação e adicione alguns!</p>
          <button 
            onClick={() => navigate('/standings')} 
            className="btn-primary"
          >
            Ver Classificação
          </button>
        </div>
      </div>
    );
  }

  // Extrair IDs dos times favoritos
  const favoriteTeamIds = favorites.map((fav: Favorite) => fav.teamId);

  // Filtrar fixtures dos times favoritos
  const favoriteFixtures = fixtures?.filter((fixture: any) => 
    favoriteTeamIds.includes(fixture.teams.home.id) || 
    favoriteTeamIds.includes(fixture.teams.away.id)
  ) || [];

  // Separar próximos jogos e jogos recentes
  const now = new Date();
  const upcomingFixtures = favoriteFixtures
    .filter((fixture: any) => new Date(fixture.fixture.date) > now)
    .sort((a: any, b: any) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());

  const recentFixtures = favoriteFixtures
    .filter((fixture: any) => new Date(fixture.fixture.date) <= now)
    .sort((a: any, b: any) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
    .slice(0, 10); // Últimos 10 jogos

  // Obter estatísticas dos favoritos
  const favoriteStats = favorites.map((fav: Favorite) => {
    const teamStanding = standings?.find((standing: any) => standing.team.id === fav.teamId);
    return {
      ...fav,
      standing: teamStanding
    };
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTeamFavorite = (teamId: number) => favoriteTeamIds.includes(teamId);

  return (
    <div className="favorites-history">
      {/* Header */}
      <div className="history-header">
        <button onClick={() => navigate('/favorites')} className="back-btn">
          ← Voltar aos Favoritos
        </button>
        <h1>⭐ Histórico dos Favoritos</h1>
        <p>Acompanhe todos os jogos dos seus {favorites.length} times favoritos</p>
      </div>

      {/* Resumo dos Favoritos */}
      <div className="favorites-summary">
        <h2>📊 Seus Times Favoritos</h2>
        <div className="favorites-grid">
          {favoriteStats.map((favorite: any) => (
            <div 
              key={favorite.teamId} 
              className="favorite-card"
              onClick={() => navigate(`/team/${favorite.teamId}`)}
            >
              <div className="team-info">
                <div className="team-logo-placeholder">🏆</div>
                <h3>{favorite.teamName}</h3>
              </div>
              {favorite.standing && (
                <div className="team-stats">
                  <div className="stat">
                    <span className="label">Posição:</span>
                    <span className="value">#{favorite.standing.rank}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Pontos:</span>  
                    <span className="value">{favorite.standing.points}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Forma:</span>
                    <span className="form">{favorite.standing.form}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Jogos */}
      <div className="upcoming-section">
        <h2>🔜 Próximos Jogos dos Favoritos</h2>
        {upcomingFixtures.length > 0 ? (
          <div className="upcoming-matches-grid">
            {upcomingFixtures.slice(0, 8).map((fixture: any, index: number) => (
              <div key={index} className="match-upcoming-card">
                <div className="match-header">
                  <span className="match-date">
                    {formatDate(fixture.fixture.date)}
                  </span>
                  <span className="match-status-badge upcoming">
                    ⏰ {new Date(fixture.fixture.date).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                <div className="match-content">
                  <div className="team-side home-side">
                    <div className="team-info-compact">
                      <img 
                        src={fixture.teams.home.logo || `https://media.api-sports.io/football/teams/${fixture.teams.home.id}.png`}
                        alt={fixture.teams.home.name}
                        className="team-logo-small"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNDMzOGNhIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="team-name-compact">
                        {fixture.teams.home.name}
                        {isTeamFavorite(fixture.teams.home.id) && (
                          <span className="fav-indicator">⭐</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="match-separator">
                    <div className="vs-divider">VS</div>
                  </div>

                  <div className="team-side away-side">
                    <div className="team-info-compact">
                      <div className="team-name-compact">
                        {fixture.teams.away.name}
                        {isTeamFavorite(fixture.teams.away.id) && (
                          <span className="fav-indicator">⭐</span>
                        )}
                      </div>
                      <img 
                        src={fixture.teams.away.logo || `https://media.api-sports.io/football/teams/${fixture.teams.away.id}.png`}
                        alt={fixture.teams.away.name}
                        className="team-logo-small"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNDMzOGNhIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="match-venue">
                  📍 {fixture.fixture.venue.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-fixtures">
            <p>📅 Não há próximos jogos programados para seus favoritos.</p>
          </div>
        )}
      </div>

      {/* Jogos Recentes */}
      <div className="recent-section">
        <h2>📈 Jogos Recentes dos Favoritos</h2>
        {recentFixtures.length > 0 ? (
          <div className="recent-matches-grid">
            {recentFixtures.map((fixture: any, index: number) => (
              <div key={index} className="match-result-card">
                <div className="match-header">
                  <span className="match-date">
                    {formatDate(fixture.fixture.date)}
                  </span>
                  <span className="match-status-badge finished">
                    ✅ Encerrado
                  </span>
                </div>
                
                <div className="match-content">
                  <div className="team-side home-side">
                    <div className="team-info-compact">
                      <img 
                        src={fixture.teams.home.logo || `https://media.api-sports.io/football/teams/${fixture.teams.home.id}.png`}
                        alt={fixture.teams.home.name}
                        className="team-logo-small"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNDMzOGNhIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="team-name-compact">
                        {fixture.teams.home.name}
                        {isTeamFavorite(fixture.teams.home.id) && (
                          <span className="fav-indicator">⭐</span>
                        )}
                      </div>
                    </div>
                    <div className="team-score">
                      {fixture.goals?.home || 0}
                    </div>
                  </div>

                  <div className="match-separator">
                    <div className="vs-divider">×</div>
                  </div>

                  <div className="team-side away-side">
                    <div className="team-score">
                      {fixture.goals?.away || 0}
                    </div>
                    <div className="team-info-compact">
                      <div className="team-name-compact">
                        {fixture.teams.away.name}
                        {isTeamFavorite(fixture.teams.away.id) && (
                          <span className="fav-indicator">⭐</span>
                        )}
                      </div>
                      <img 
                        src={fixture.teams.away.logo || `https://media.api-sports.io/football/teams/${fixture.teams.away.id}.png`}
                        alt={fixture.teams.away.name}
                        className="team-logo-small"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNDMzOGNhIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="match-venue">
                  📍 {fixture.fixture.venue.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-fixtures">
            <p>📊 Não há jogos recentes dos favoritos disponíveis.</p>
          </div>
        )}
      </div>

      {/* Footer com info */}
      <div className="history-footer">
        <small>
          💾 Dados otimizados em cache | Sem consumo extra de API
          <br />
          Atualize a página para sincronizar com os dados mais recentes
        </small>
      </div>
    </div>
  );
};

export default FavoritesHistory;