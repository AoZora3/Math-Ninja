import React from 'react';

export const Frame = ({ children }) => {
  return (
    <div className="stage-wrapper">
      <div className="mobile-frame">
        {/* Status Bar */}
        <div className="phone-status-bar">
          <span className="phone-clock">9:41</span>
          <div className="phone-notch">
            <div className="notch-camera" />
            <div className="notch-sensor" />
          </div>
          <div className="phone-status-icons">
            <svg width="12" height="10" viewBox="0 0 14 10" fill="currentColor">
              <rect x="0" y="7" width="2" height="3" rx="0.5" />
              <rect x="4" y="5" width="2" height="5" rx="0.5" />
              <rect x="8" y="2" width="2" height="8" rx="0.5" />
              <rect x="12" y="0" width="2" height="10" rx="0.5" />
            </svg>
            <svg width="12" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
            </svg>
            <svg width="18" height="10" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="1" width="18" height="10" rx="2" />
              <path d="M21 4v4" />
              <rect x="3" y="3" width="12" height="6" rx="1" fill="#00e5ff" stroke="none" />
            </svg>
          </div>
        </div>

        {/* Viewport */}
        <main className="screen-content">
          {children}
        </main>

        {/* Home Indicator */}
        <div className="phone-home-indicator" />
      </div>
    </div>
  );
};
