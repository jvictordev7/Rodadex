import React from 'react';
import { useLeagueFixtures } from '../hooks/useApi';
import MatchSkeleton from '../components/Skeleton/MatchSkeleton';
import './Home.css';

const Home: React.FC = () => {
  const { data: fixtures, isLoading, error } = useLeagueFixtures();

  if (isLoading) {
    return (
      <div className="home">
        <div className="home-header">
          <h1>🏆 Brasileirão Série A</h1>
          <p>Carregando próximos jogos...</p>
          <span className="season-info">📅 Temporada 2023</span>
        </div>
        <div className="fixtures">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={`animate-fade-in-up stagger-delay-${Math.min(index + 1, 5)}`}>
              <MatchSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home-header">
          <h1>🏆 Brasileirão Série A</h1>
          <p>Erro ao carregar jogos</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home animate-fade-in">
      <div className="home-header animate-fade-in-down">
        <h1>🏆 Brasileirão Série A</h1>
        <p>Próximos jogos da rodada</p>
        <span className="season-info">📅 Temporada 2023</span>
      </div>
      
      <div className="fixtures-container">
        {fixtures && Array.isArray(fixtures) && fixtures.slice(0, 5).map((fixture: any, index: number) => (
          <div 
            key={fixture.fixture?.id || Math.random()} 
            className={`fixture-card animate-fade-in-up hover-lift stagger-delay-${Math.min(index + 1, 5)}`}
          >
            <div className="fixture-info">
              <span className="fixture-date">
                {formatDate(fixture.fixture?.date || fixture.date)}
              </span>
              <div className="fixture-teams home-fixture-teams">
                <div className="team team-home home-team">
                  {fixture.teams?.home?.logo && fixture.teams.home.logo !== '' ? (
                    <img 
                      src={fixture.teams.home.logo} 
                      alt={fixture.teams.home.name}
                      className="team-logo"
                      onLoad={() => console.log(`Logo carregada (Home): ${fixture.teams.home.name}`)}
                      onError={(e) => {
                        console.log(`Erro logo (Home): ${fixture.teams.home.name}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="team-logo-placeholder">⚽</div>
                  )}
                  <span>{fixture.teams?.home?.name || fixture.homeTeam?.name || 'Time Casa'}</span>
                </div>
                <span className="vs home-vs">VS</span>
                <div className="team team-away home-team">
                  <span>{fixture.teams?.away?.name || fixture.awayTeam?.name || 'Time Fora'}</span>
                  {fixture.teams?.away?.logo && fixture.teams.away.logo !== '' ? (
                    <img 
                      src={fixture.teams.away.logo} 
                      alt={fixture.teams.away.name}
                      className="team-logo"
                      onLoad={() => console.log(`Logo carregada (Home): ${fixture.teams.away.name}`)}
                      onError={(e) => {
                        console.log(`Erro logo (Home): ${fixture.teams.away.name}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="team-logo-placeholder">⚽</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {(!fixtures || !Array.isArray(fixtures) || fixtures.length === 0) && (
          <div className="fixture-card">
            <div className="fixture-info">
              <span className="fixture-date">Nenhum jogo encontrado</span>
              <div className="fixture-teams">
                <div className="team">
                  <span>Dados indisponíveis</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;