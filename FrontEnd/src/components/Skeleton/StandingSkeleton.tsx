import React from 'react';
import Skeleton from './Skeleton';
import './StandingSkeleton.css';

const StandingSkeleton: React.FC = () => {
  return (
    <div className="standings-skeleton">
      {/* Header da tabela */}
      <div className="standings-skeleton-header">
        <Skeleton width="100%" height="40px" className="skeleton-card" />
      </div>
      
      {/* Linhas da tabela */}
      {[...Array(20)].map((_, index) => (
        <div key={index} className="standing-row-skeleton">
          <div className="standing-position">
            <Skeleton width="24px" height="20px" className="skeleton-text" />
          </div>
          
          <div className="standing-team">
            <Skeleton width="32px" height="32px" className="skeleton-circle" />
            <Skeleton width="120px" height="16px" className="skeleton-text" />
          </div>
          
          <div className="standing-stats">
            <Skeleton width="30px" height="16px" className="skeleton-text" />
            <Skeleton width="30px" height="16px" className="skeleton-text" />
            <Skeleton width="30px" height="16px" className="skeleton-text" />
            <Skeleton width="30px" height="16px" className="skeleton-text" />
            <Skeleton width="40px" height="16px" className="skeleton-text" />
          </div>
          
          <div className="standing-favorite">
            <Skeleton width="24px" height="24px" className="skeleton-circle" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StandingSkeleton;