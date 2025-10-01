import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites, useRemoveFavorite } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Favorite } from '../types';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import './Favorites.css';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data: favorites, isLoading, error, refetch } = useFavorites();
  const removeFavoriteMutation = useRemoveFavorite();

  // Função para gerar logo baseada no teamId (usando API-Sports pattern)
  const getTeamLogo = (teamId: number) => {
    return `https://media.api-sports.io/football/teams/${teamId}.png`;
  };

  const handleRemoveFavorite = async (teamId: number) => {
    if (window.confirm('Tem certeza que deseja remover este time dos favoritos?')) {
      try {
        await removeFavoriteMutation.mutateAsync(teamId);
        addToast({
          type: 'success',
          title: 'Time removido!',
          message: 'Time removido dos favoritos com sucesso.'
        });
      } catch (error) {
        console.error('Erro ao remover favorito:', error);
        addToast({
          type: 'error',
          title: 'Erro ao remover',
          message: 'Não foi possível remover o time dos favoritos. Tente novamente.'
        });
      }
    }
  };

  if (isLoading) {
    return <Loading text="Carregando favoritos..." fullscreen />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Erro ao carregar favoritos. Tente novamente."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Meus Favoritos</h1>
              <p>Olá, {user?.name}! Aqui estão seus times favoritos</p>
            </div>
            <button 
              className="history-btn"
              onClick={() => navigate('/favorites/history')}
              title="Ver histórico completo dos favoritos"
            >
              📊 Histórico dos Jogos
            </button>
          </div>
        </div>

        {!favorites || favorites.length === 0 ? (
          <div className="no-favorites">
            <div className="no-favorites-icon">⭐</div>
            <h3>Nenhum time favorito ainda</h3>
            <p>
              Navegue pela classificação e adicione seus times favoritos 
              para acompanhar mais de perto seus resultados.
            </p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((favorite: Favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="team-header">
                  <img 
                    src={getTeamLogo(favorite.teamId)}
                    alt={favorite.teamName}
                    className="team-logo-large"
                    onLoad={() => console.log(`Logo carregada (Favoritos): ${favorite.teamName} - ${getTeamLogo(favorite.teamId)}`)}
                    onError={(e) => {
                      console.log(`Erro ao carregar logo (Favoritos): ${favorite.teamName} - ${getTeamLogo(favorite.teamId)}`);
                      e.currentTarget.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = 'team-logo-placeholder-large';
                      placeholder.textContent = '🏆';
                      e.currentTarget.parentNode?.insertBefore(placeholder, e.currentTarget);
                    }}
                  />
                  <h3 className="team-name">{favorite.teamName}</h3>
                </div>
                <div className="favorite-content">
                  <div className="favorite-info">
                    <span className="added-date">
                      Adicionado em {new Date(favorite.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="favorite-actions">
                  <button
                    onClick={() => handleRemoveFavorite(favorite.teamId)}
                    className="remove-button"
                    disabled={removeFavoriteMutation.isPending}
                  >
                    {removeFavoriteMutation.isPending ? 'Removendo...' : '🗑️ Remover'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="favorites-info">
          <div className="info-card">
            <h3>💡 Dica</h3>
            <p>
              Visite a página de classificação para adicionar mais times aos seus favoritos. 
              Você poderá acompanhar os próximos jogos e resultados dos seus times preferidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;