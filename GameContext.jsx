import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  // Combo Subsystem State
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [streak, setStreak] = useState(0);

  // Timers State
  const [countUpTime, setCountUpTime] = useState(0);
  const [countDownTime, setCountDownTime] = useState(60);

  // Backend Hit-rate Tracking State (Not exposed directly on the HUD)
  const [stats, setStats] = useState({
    totalAttempts: 0, // Number of equation slice checks triggered
    totalHits: 0,     // Total fruit items sliced
    totalMisses: 0,   // Slice actions that hit zero fruit targets
    bombHits: 0,      // Number of bombs sliced
  });

  /**
   * Calculates backend Hit-Rate Percentage
   * Formula: (Total Fruit Hits / Total Attempts) * 100
   */
  const getHitRate = useCallback(() => {
    if (stats.totalAttempts === 0) return 0;
    return Math.round((stats.totalHits / stats.totalAttempts) * 100);
  }, [stats]);

  /**
   * Process slice attempt outcome and recalculate combo & hit-rate statistics
   */
  const recordSliceAttempt = useCallback(({ fruitHits, bombHits }) => {
    setStats((prev) => ({
      totalAttempts: prev.totalAttempts + 1,
      totalHits: prev.totalHits + fruitHits,
      totalMisses: prev.totalMisses + (fruitHits === 0 && bombHits === 0 ? 1 : 0),
      bombHits: prev.bombHits + bombHits,
    }));

    if (bombHits > 0) {
      // Reset combo on bomb contact
      setComboMultiplier(1);
      setStreak(0);
    } else if (fruitHits > 0) {
      // Increment streak and boost multiplier based on consecutive hits
      setStreak((prevStreak) => {
        const nextStreak = prevStreak + fruitHits;
        if (nextStreak >= 6) setComboMultiplier(3);
        else if (nextStreak >= 3) setComboMultiplier(2);
        else setComboMultiplier(1);
        return nextStreak;
      });
    } else {
      // Missed all fruit targets
      setComboMultiplier(1);
      setStreak(0);
    }
  }, []);

  const resetGameStats = useCallback(() => {
    setScore(0);
    setLives(3);
    setComboMultiplier(1);
    setStreak(0);
    setCountUpTime(0);
    setCountDownTime(60);
    setStats({
      totalAttempts: 0,
      totalHits: 0,
      totalMisses: 0,
      bombHits: 0,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        score,
        setScore,
        lives,
        setLives,
        comboMultiplier,
        streak,
        stats,
        getHitRate,
        recordSliceAttempt,
        countUpTime,
        setCountUpTime,
        countDownTime,
        setCountDownTime,
        resetGameStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within a GameProvider');
  return context;
}