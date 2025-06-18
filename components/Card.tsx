
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '', actions }) => {
  return (
    <div className={`bg-slate-800 shadow-xl rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center ${actions ? 'pb-3 sm:pb-4' : ''}`}>
          <h3 className={`text-xl font-semibold text-slate-100 ${titleClassName}`}>{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
