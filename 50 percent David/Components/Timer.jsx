import React, { useEffect, useState } from 'react';

/**
 * Dual-mode Timer Component
 * @param {'countup' | 'countdown'} mode - Timer operating mode
 * @param {number} initialTime - Time in seconds for countdown mode
 * @param {boolean} isActive - Controls active ticking state
 * @param {function} onTimeUp - Callback fired when countdown reaches 0
 * @param {function} onTick - Callback fired on every second update
 */
export default function Timer({
  mode = 'countup',
  initialTime = 60,
  isActive = true,
  onTimeUp,
  onTick,
}) {
  const [seconds, setSeconds] = useState(mode === 'countdown' ? initialTime : 0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              clearInterval(interval);
              if (onTimeUp) onTimeUp();
              return 0;
            }
            const next = prev - 1;
            if (onTick) onTick(next);
            return next;
          } else {
            const next = prev + 1;
            if (onTick) onTick(next);
            return next;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, mode, initialTime, onTimeUp, onTick]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span className="timer-label">{mode === 'countdown' ? '⏳ REMAINING' : '⏱ ELAPSED'}</span>
      <span
        className="timer-value"
        style={{
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: mode === 'countdown' && seconds <= 10 ? '#e63946' : 'inherit',
        }}
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
}