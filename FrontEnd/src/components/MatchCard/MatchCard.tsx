import React from 'react';
import type { Fixture } from '../../types';
import { formatDate, formatTime, getMatchStatus, getStatusColor } from '../../utils';
import './MatchCard.css';

interface MatchCardProps {
  fixture: Fixture;
  onClick?: (fixture: Fixture) => void;
  showDate?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  fixture, 
  onClick, 
  showDate = true 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(fixture);
    }
  };

  const statusColor = getStatusColor(fixture.status.short);
  const statusText = getMatchStatus(fixture.status.short);

  return (
    <div 
      className={`match-card ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="match-header">
        {showDate && (
          <div className="match-date">
            {formatDate(fixture.date)}
          </div>
        )}
        <div 
          className="match-status"
          style={{ color: statusColor }}
        >
          {statusText}
          {fixture.status.elapsed && ` (${fixture.status.elapsed}')`}
        </div>
      </div>

      <div className="match-teams">
        <div className="team home-team">
          <img 
            src={fixture.teams.home.logo} 
            alt={fixture.teams.home.name}
            className="team-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="team-name">{fixture.teams.home.name}</span>
        </div>

        <div className="match-score">
          {fixture.status.short === 'NS' ? (
            <div className="match-time">
              {formatTime(fixture.date)}
            </div>
          ) : (
            <div className="score">
              <span className="home-score">
                {fixture.goals.home ?? 0}
              </span>
              <span className="score-separator">x</span>
              <span className="away-score">
                {fixture.goals.away ?? 0}
              </span>
            </div>
          )}
        </div>

        <div className="team away-team">
          <img 
            src={fixture.teams.away.logo} 
            alt={fixture.teams.away.name}
            className="team-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="team-name">{fixture.teams.away.name}</span>
        </div>
      </div>

      <div className="match-info">
        <span className="league-round">{fixture.league.round}</span>
      </div>
    </div>
  );
};

export default MatchCard;