import React from 'react';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default PageTransition;