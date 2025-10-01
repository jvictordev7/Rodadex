import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStandings, useFavorites, useAddFavorite, useRemoveFavorite } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StandingSkeleton from '../components/Skeleton/StandingSkeleton';
import './Standings.css';

// Tipos de filtros disponíveis
type FilterType = 'todos' | 'libertadores' | 'pre-libertadores' | 'sulamericana' | 'rebaixamento' | 'favoritos';

const Standings: React.FC = () => {
  const navigate = useNavigate();
  const { data: standings, isLoading, error } = useStandings();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data: favorites, isLoading: favoritesLoading, error: favoritesError } = useFavorites();
  
  // Estados dos filtros
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hooks para mutations
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();
  
  console.log('=== FAVORITOS DEBUG ===');
  console.log('Favorites data:', favorites);
  console.log('Favorites loading:', favoritesLoading);
  console.log('Favorites error:', favoritesError);
  
  console.log('=== STANDINGS DEBUG ===');
  console.log('Standings data:', standings?.slice(0, 2)); // Mostra os 2 primeiros times com logos

  // Função para filtrar times por zona
  const getZone = (position: number): FilterType => {
    if (position <= 4) return 'libertadores';
    if (position <= 6) return 'pre-libertadores';
    if (position <= 12) return 'sulamericana';
    if (position >= 17) return 'rebaixamento';
    return 'todos';
  };

  // Labels dos filtros
  const getFilterLabel = (filter: FilterType): string => {
    const labels = {
      'todos': 'Todos',
      'libertadores': 'Libertadores',
      'pre-libertadores': 'Pré-Libertadores',
      'sulamericana': 'Sul-Americana',
      'rebaixamento': 'Rebaixamento',
      'favoritos': 'Meus Favoritos'
    };
    return labels[filter];
  };

  // Filtros inteligentes com useMemo para performance
  const filteredStandings = useMemo(() => {
    let baseStandings = standings && standings.length > 0 ? standings : [
      {
        rank: 1,
        team: { id: 127, name: 'Botafogo', logo: '' },
        points: 70,
        goalsDiff: 28,
        form: 'WWWWW',
        all: { played: 32, win: 22, draw: 4, lose: 6, goals: { for: 58, against: 30 } }
      },
      {
        rank: 2,
        team: { id: 128, name: 'Palmeiras', logo: '' },
        points: 67,
        goalsDiff: 25,
        form: 'WWLWW',
        all: { played: 32, win: 20, draw: 7, lose: 5, goals: { for: 55, against: 30 } }
      },
      {
        rank: 3,
        team: { id: 129, name: 'Flamengo', logo: '' },
        points: 63,
        goalsDiff: 18,
        form: 'WLWWW',
        all: { played: 31, win: 19, draw: 6, lose: 6, goals: { for: 52, against: 34 } }
      },
      {
        rank: 4,
        team: { id: 130, name: 'Fortaleza', logo: '' },
        points: 60,
        goalsDiff: 12,
        form: 'LWWDW',
        all: { played: 32, win: 18, draw: 6, lose: 8, goals: { for: 45, against: 33 } }
      }
    ];

    // 1. Filtro por texto (nome do time)
    if (searchTerm) {
      baseStandings = baseStandings.filter((team: any) =>
        team.team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtros por zona
    if (activeFilter !== 'todos') {
      baseStandings = baseStandings.filter((team: any) => {
        const zone = getZone(team.rank);
        
        if (activeFilter === 'favoritos') {
          return favorites?.some((fav: any) => fav.teamId === team.team.id) || false;
        }
        
        return zone === activeFilter;
      });
    }

    return baseStandings;
  }, [standings, activeFilter, searchTerm, favorites]);

  // Mantém compatibilidade com código existente
  const displayStandings = filteredStandings;

  const isFavorite = (teamId: number) => {
    return favorites?.some((fav: any) => fav.teamId === teamId) || false;
  };

  const handleToggleFavorite = async (team: any) => {
    console.log('=== TOGGLE FAVORITO ===');
    console.log('User logado:', user);
    console.log('Team:', team);
    console.log('Token no localStorage:', localStorage.getItem('token'));
    
    if (!user) {
      addToast({
        type: 'warning',
        title: 'Login necessário',
        message: 'Você precisa estar logado para adicionar favoritos'
      });
      return;
    }

    try {
      const isFav = isFavorite(team.id);
      console.log('É favorito?', isFav);
      
      if (isFav) {
        console.log('Removendo favorito...');
        await removeFavoriteMutation.mutateAsync(team.id);
        console.log('Favorito removido com sucesso!');
        addToast({
          type: 'success',
          title: 'Time removido!',
          message: `${team.name} foi removido dos seus favoritos`
        });
      } else {
        console.log('Adicionando favorito...');
        const result = await addFavoriteMutation.mutateAsync({
          teamId: team.id,
          teamName: team.name
        });
        console.log('Favorito adicionado com sucesso!', result);
        addToast({
          type: 'success',
          title: 'Time adicionado!',
          message: `${team.name} foi adicionado aos seus favoritos`
        });
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      addToast({
        type: 'error',
        title: 'Erro ao alterar favorito',
        message: 'Não foi possível alterar o favorito. Tente novamente.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="standings">
        <div className="standings-header">
          <h1>📊 Classificação - Brasileirão Série A</h1>
          <span className="season-info">📅 Temporada 2023</span>
        </div>
        <div className="animate-fade-in-up">
          <StandingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Erro ao carregar standings:', error);
  }



  const getPositionClass = (rank: number) => {
    if (rank === 1) return 'first-place';
    if (rank <= 4) return 'libertadores';
    if (rank <= 6) return 'sulamericana';
    if (rank >= 17) return 'relegation';
    return '';
  };

  return (
    <div className="standings animate-fade-in">
      <div className="standings-header animate-fade-in-down">
        <h1>📊 Classificação - Brasileirão Série A</h1>
        <span className="season-info">📅 Temporada 2023</span>
        {error && (
          <p style={{ color: '#ffcccb', fontSize: '0.9rem' }}>
            Usando dados de exemplo (backend indisponível)
          </p>
        )}
      </div>

      {/* Seção de Filtros */}
      <div className="filters-section animate-slide-in-up">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todos')}
          >
            📊 Todos
          </button>
          
          <button
            className={`filter-btn libertadores ${activeFilter === 'libertadores' ? 'active' : ''}`}
            onClick={() => setActiveFilter('libertadores')}
          >
            🏆 Libertadores
          </button>
          
          <button
            className={`filter-btn pre-libertadores ${activeFilter === 'pre-libertadores' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pre-libertadores')}
          >
            🎯 Pré-Libertadores
          </button>
          
          <button
            className={`filter-btn sulamericana ${activeFilter === 'sulamericana' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sulamericana')}
          >
            🎪 Sul-Americana
          </button>
          
          <button
            className={`filter-btn rebaixamento ${activeFilter === 'rebaixamento' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rebaixamento')}
          >
            ⚠️ Rebaixamento
          </button>
          
          {user && (
            <button
              className={`filter-btn favoritos ${activeFilter === 'favoritos' ? 'active' : ''}`}
              onClick={() => setActiveFilter('favoritos')}
            >
              ⭐ Meus Favoritos
            </button>
          )}
        </div>
        
        {/* Contador de resultados */}
        <div className="results-count">
          {filteredStandings.length} time{filteredStandings.length !== 1 ? 's' : ''} 
          {activeFilter !== 'todos' && (
            <span className="filter-active"> - Filtro: {getFilterLabel(activeFilter)}</span>
          )}
        </div>
      </div>

      {/* Estado Vazio Inteligente */}
      {filteredStandings.length === 0 ? (
        <div className="empty-results animate-fade-in">
          <h3>🔍 Nenhum time encontrado</h3>
          <p>
            {searchTerm 
              ? `Não encontramos times com "${searchTerm}"`
              : `Não há times na categoria "${getFilterLabel(activeFilter)}"`
            }
          </p>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setActiveFilter('todos');
              setSearchTerm('');
            }}
          >
            🔄 Limpar Filtros
          </button>
        </div>
      ) : (
      <>
        <div className="standings-table">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Time</th>
              <th>P</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>SG</th>
              <th>⭐</th>
            </tr>
          </thead>
          <tbody>
            {displayStandings.map((standing: any, index: number) => (
              <tr 
                key={standing.team.id} 
                className={`${getPositionClass(standing.rank)} animate-fade-in-left transition-all hover-lift stagger-delay-${Math.min(Math.floor(index / 4) + 1, 5)} team-row`}
                onClick={() => navigate(`/team/${standing.team.id}`)}
                title={`Ver detalhes de ${standing.team.name}`}
              >
                <td className="position">{standing.rank}</td>
                <td className="team-name">
                  <div className="team-info">
                    {standing.team.logo && standing.team.logo !== '' ? (
                      <img 
                        src={standing.team.logo} 
                        alt={standing.team.name}
                        className="team-logo"
                        onLoad={() => console.log(`Logo carregada para ${standing.team.name}: ${standing.team.logo}`)}
                        onError={(e) => {
                          console.log(`Erro ao carregar logo para ${standing.team.name}: ${standing.team.logo}`);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="team-logo-placeholder">🏆</div>
                    )}
                    <span>{standing.team.name}</span>
                  </div>
                </td>
                <td className="points">{standing.points}</td>
                <td>{standing.all.played}</td>
                <td>{standing.all.win}</td>
                <td>{standing.all.draw}</td>
                <td>{standing.all.lose}</td>
                <td className={standing.goalsDiff >= 0 ? 'positive' : 'negative'}>
                  {standing.goalsDiff >= 0 ? '+' : ''}{standing.goalsDiff}
                </td>
                <td className="favorite-cell">
                  <button
                    className={`favorite-btn ${isFavorite(standing.team.id) ? 'favorited animate-heartbeat' : ''} hover-scale transition-all`}
                    onClick={() => handleToggleFavorite(standing.team)}
                    title={isFavorite(standing.team.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    {isFavorite(standing.team.id) ? '⭐' : '☆'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color first-place"></span>
          <span>Campeão</span>
        </div>
        <div className="legend-item">
          <span className="legend-color libertadores"></span>
          <span>Libertadores</span>
        </div>
        <div className="legend-item">
          <span className="legend-color sulamericana"></span>
          <span>Sul-Americana</span>
        </div>
        <div className="legend-item">
          <span className="legend-color relegation"></span>
          <span>Rebaixamento</span>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Standings;