import React from 'react';
import Skeleton from './Skeleton';
import './MatchSkeleton.css';

const MatchSkeleton: React.FC = () => {
  return (
    <div className="match-skeleton">
      <div className="match-skeleton-header">
        <Skeleton width="80px" height="16px" className="skeleton-text" />
        <Skeleton width="60px" height="14px" className="skeleton-text" />
      </div>
      
      <div className="match-skeleton-teams">
        <div className="team-skeleton">
          <Skeleton width="40px" height="40px" className="skeleton-circle" />
          <Skeleton width="80px" height="16px" className="skeleton-text" />
        </div>
        
        <div className="match-skeleton-vs">
          <Skeleton width="30px" height="20px" className="skeleton-text" />
        </div>
        
        <div className="team-skeleton">
          <Skeleton width="40px" height="40px" className="skeleton-circle" />
          <Skeleton width="80px" height="16px" className="skeleton-text" />
        </div>
      </div>
      
      <div className="match-skeleton-info">
        <Skeleton width="100px" height="14px" className="skeleton-text" />
        <Skeleton width="60px" height="14px" className="skeleton-text" />
      </div>
    </div>
  );
};

export default MatchSkeleton;