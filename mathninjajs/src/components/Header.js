import React from 'react';
import { BackArrowIcon } from './Icons';

export const Header = ({ title, onBack, rightAction }) => {
  return (
    <header className="screen-header">
      {onBack ? (
        <button 
          className="header-btn" 
          onClick={onBack} 
          aria-label="Back"
          type="button"
        >
          <BackArrowIcon />
        </button>
      ) : (
        <div className="header-spacer" />
      )}
      
      <h1 className="header-title">{title}</h1>
      
      {rightAction ? (
        rightAction
      ) : (
        <div className="header-spacer" />
      )}
    </header>
  );
};
