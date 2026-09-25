import React from 'react';

export default function Combo({ multiplier = 1, streak = 0 }) {
  return (
    <div className="combo-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        className="combo-multiplier"
        style={{
          fontSize: '1.2rem',
          fontWeight: '800',
          color: multiplier > 1 ? '#ffb703' : '#888',
        }}
      >
        {multiplier}x
      </span>
      {streak > 1 && (
        <span className="combo-streak" style={{ fontSize: '0.85rem', color: '#fb8500', fontWeight: '600' }}>
          ({streak} STREAK)
        </span>
      )}
    </div>
  );
}