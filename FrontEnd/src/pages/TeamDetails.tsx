import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeamDetails } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';
import './TeamDetails.css';

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const teamId = parseInt(id || '0');

  const { data: teamDetails, isLoading, error } = useTeamDetails(teamId);

  if (isLoading) {
    return (
      <div className="team-details loading">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-stats"></div>
          <div className="skeleton-fixtures"></div>
        </div>
      </div>
    );
  }

  if (error || !teamDetails) {
    addToast({ title: 'Erro', message: 'Erro ao carregar detalhes do time', type: 'error' });
    return (
      <div className="team-details error">
        <div className="error-message">
          <h2>⚠️ Time não encontrado</h2>
          <p>Não foi possível carregar os detalhes do time.</p>
          <button onClick={() => navigate('/standings')} className="btn-primary">
            Voltar à Classificação
          </button>
        </div>
      </div>
    );
  }

  const { team, stats, fixtures } = teamDetails;

  // Análise da forma recente
  const formAnalysis = stats.form.split('').map((result: string) => ({
    result,
    color: result === 'W' ? '#22c55e' : result === 'D' ? '#f59e0b' : '#ef4444'
  }));

  // Status da classificação
  const getPositionStatus = (position: number) => {
    if (position <= 4) return { text: 'Libertadores', class: 'libertadores' };
    if (position <= 6) return { text: 'Pré-Libertadores', class: 'pre-libertadores' };
    if (position <= 12) return { text: 'Sul-Americana', class: 'sulamericana' };
    if (position >= 17) return { text: 'Rebaixamento', class: 'rebaixamento' };
    return { text: 'Meio da Tabela', class: 'neutral' };
  };

  const positionStatus = getPositionStatus(stats.position);

  return (
    <div className="team-details">
      {/* Header do Time */}
      <div className="team-header">
        <button onClick={() => navigate('/standings')} className="back-btn">
          ← Voltar
        </button>
        
        <div className="team-info">
          <img src={team.logo} alt={`${team.name} logo`} className="team-logo-large" />
          <div className="team-title">
            <h1>{team.name}</h1>
            <div className="position-badge">
              <span className="position">#{stats.position}</span>
              <span className={`status ${positionStatus.class}`}>
                {positionStatus.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="stats-grid">
        <div className="stat-card points">
          <h3>Pontos</h3>
          <div className="stat-value">{stats.points}</div>
        </div>
        
        <div className="stat-card games">
          <h3>Jogos</h3>
          <div className="stat-value">{stats.played}</div>
        </div>
        
        <div className="stat-card wins">
          <h3>Vitórias</h3>
          <div className="stat-value">{stats.wins}</div>
          <div className="stat-percentage">{stats.winPercentage}%</div>
        </div>
        
        <div className="stat-card goal-diff">
          <h3>Saldo</h3>
          <div className={`stat-value ${stats.goalDifference >= 0 ? 'positive' : 'negative'}`}>
            {stats.goalDifference > 0 ? '+' : ''}{stats.goalDifference}
          </div>
        </div>
      </div>

      {/* Desempenho Detalhado */}
      <div className="performance-section">
        <h2>📊 Desempenho no Brasileirão 2023</h2>
        
        <div className="performance-grid">
          <div className="performance-card">
            <h4>Resultados</h4>
            <div className="results-breakdown">
              <div className="result-item wins">
                <span className="result-icon">✅</span>
                <span className="result-count">{stats.wins}</span>
                <span className="result-label">Vitórias</span>
              </div>
              <div className="result-item draws">
                <span className="result-icon">🟡</span>
                <span className="result-count">{stats.draws}</span>
                <span className="result-label">Empates</span>
              </div>
              <div className="result-item losses">
                <span className="result-icon">❌</span>
                <span className="result-count">{stats.losses}</span>
                <span className="result-label">Derrotas</span>
              </div>
            </div>
          </div>

          <div className="performance-card">
            <h4>Gols</h4>
            <div className="goals-stats">
              <div className="goals-item">
                <span className="goals-label">Marcados</span>
                <span className="goals-value">{stats.goalsFor}</span>
                <span className="goals-avg">({stats.avgGoalsFor}/jogo)</span>
              </div>
              <div className="goals-item">
                <span className="goals-label">Sofridos</span>
                <span className="goals-value">{stats.goalsAgainst}</span>
                <span className="goals-avg">({stats.avgGoalsAgainst}/jogo)</span>
              </div>
            </div>
          </div>

          <div className="performance-card">
            <h4>Forma Recente</h4>
            <div className="form-display">
              {formAnalysis.map((item: any, index: number) => (
                <div 
                  key={index}
                  className="form-result"
                  style={{ backgroundColor: item.color }}
                  title={item.result === 'W' ? 'Vitória' : item.result === 'D' ? 'Empate' : 'Derrota'}
                >
                  {item.result}
                </div>
              )).reverse()}
              <span className="form-label">Últimos 5 jogos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Jogos */}
      {fixtures.length > 0 && (
        <div className="fixtures-section">
          <h2>⚽ Próximos Jogos</h2>
          <div className="fixtures-list">
            {fixtures.slice(0, 5).map((fixture: any, index: number) => (
              <div key={index} className="fixture-card">
                <div className="fixture-date">
                  {new Date(fixture.fixture.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="fixture-teams">
                  <div className="team-home">
                    <img src={fixture.teams.home.logo} alt="" className="team-logo-small" />
                    <span>{fixture.teams.home.name}</span>
                  </div>
                  <div className="vs">VS</div>
                  <div className="team-away">
                    <span>{fixture.teams.away.name}</span>
                    <img src={fixture.teams.away.logo} alt="" className="team-logo-small" />
                  </div>
                </div>
                <div className="fixture-venue">
                  📍 {fixture.fixture.venue.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer com Info de Cache */}
      <div className="cache-info">
        <small>
          💾 Dados em cache | Otimizado para plano gratuito
          <br />
          Última atualização: {new Date(teamDetails.lastUpdated).toLocaleString('pt-BR')}
        </small>
      </div>
    </div>
  );
};

export default TeamDetails;