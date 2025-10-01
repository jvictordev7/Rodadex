import React from 'react';
import type { Standing } from '../../types';
import { getPositionColor } from '../../utils';
import './StandingsTable.css';

interface StandingsTableProps {
  standings: Standing[];
  onTeamClick?: (teamId: number) => void;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ 
  standings, 
  onTeamClick 
}) => {
  return (
    <div className="standings-table-container">
      <div className="standings-table">
        <div className="table-header">
          <div className="position-column">#</div>
          <div className="team-column">Time</div>
          <div className="stats-column">P</div>
          <div className="stats-column">J</div>
          <div className="stats-column">V</div>
          <div className="stats-column">E</div>
          <div className="stats-column">D</div>
          <div className="stats-column">GP</div>
          <div className="stats-column">GC</div>
          <div className="stats-column">SG</div>
        </div>

        {standings.map((standing) => (
          <div 
            key={standing.team.id}
            className={`table-row ${onTeamClick ? 'clickable' : ''}`}
            onClick={() => onTeamClick?.(standing.team.id)}
            style={{ 
              borderLeft: `4px solid ${getPositionColor(standing.rank)}` 
            }}
          >
            <div className="position-column">
              <span className="position">{standing.rank}</span>
            </div>
            
            <div className="team-column">
              <img 
                src={standing.team.logo} 
                alt={standing.team.name}
                className="team-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="team-name">{standing.team.name}</span>
            </div>
            
            <div className="stats-column points">{standing.points}</div>
            <div className="stats-column">{standing.all.played}</div>
            <div className="stats-column wins">{standing.all.win}</div>
            <div className="stats-column draws">{standing.all.draw}</div>
            <div className="stats-column losses">{standing.all.lose}</div>
            <div className="stats-column">{standing.all.goals.for}</div>
            <div className="stats-column">{standing.all.goals.against}</div>
            <div className="stats-column goal-diff">
              {standing.goalsDiff > 0 ? '+' : ''}{standing.goalsDiff}
            </div>
          </div>
        ))}
      </div>

      <div className="standings-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#1e90ff' }}></div>
          <span>Libertadores</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#87ceeb' }}></div>
          <span>Pré-Libertadores</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ffa500' }}></div>
          <span>Sul-Americana</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff4500' }}></div>
          <span>Rebaixamento</span>
        </div>
      </div>
    </div>
  );
};

export default StandingsTable;