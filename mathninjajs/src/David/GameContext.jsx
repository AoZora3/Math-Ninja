import React, { createContext, useState, useEffect } from 'react';
import { checkEquationSlice } from '../Game/Collision.js';
import { stage1Presets } from '../Game/Equations/StagePreset1.js';

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [presets, setPresets] = useState(stage1Presets);
  const [activePreset, setActivePreset] = useState(stage1Presets[0]);
  const [currentScreen, setCurrentScreen] = useState('splash');

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [spawnedObjects, setSpawnedObjects] = useState([]);
  const [highScore, setHighScore] = useState(0);

  const range = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

  useEffect(() => {
    fetch('http://localhost:5000/api/high-score')
      .then(res => res.json())
      .then(data => setHighScore(data.highScore))
      .catch(err => console.log("Server offline, using local state"));
  }, [currentScreen]);

  function handleCoefficientSlider(presetId, key, value) {
    setPresets(prev => {
      const updated = prev.map(p =>
        p.id === presetId ? { ...p, coefficients: { ...p.coefficients, [key]: value } } : p
      );
      const current = updated.find(p => p.id === activePreset.id);
      if (current) setActivePreset(current);
      return updated;
    });
  }

  function startGameplay() {
    setScore(0);
    setLives(3);
    setTimeLeft(45);
    setSpawnedObjects([]);
    setCurrentScreen('gameplay');
  }

  async function sendScoreToBackend(finalScore) {
    try {
      await fetch('http://localhost:5000/api/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: finalScore })
      });
    } catch (err) {
      console.log("Could not save score to server");
    }
  }

  useEffect(() => {
    if (currentScreen !== 'gameplay') return;

    const clockTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(clockTimer);
          sendScoreToBackend(score);
          setCurrentScreen('stageComplete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnerTimer = setInterval(() => {
      const isBomb = Math.random() < 0.25;
      const newObject = {
        id: Math.random().toString(),
        x: Math.random() * 14 - 7,
        y: Math.random() * 14 - 7,
        type: isBomb ? 'bomb' : 'fruit',
        spawnTime: Date.now()
      };
      setSpawnedObjects(prev => [...prev, newObject]);
    }, 1500);

    return () => {
      clearInterval(clockTimer);
      clearInterval(spawnerTimer);
    };
  }, [currentScreen, score]);

  function fireEquationStrike() {
    let scoreChange = 0;
    let lifeChange = 0;

    const remaining = spawnedObjects.filter(obj => {
      const isHit = checkEquationSlice(obj, activePreset);

      if (isHit) {
        if (obj.type === 'fruit') {
          scoreChange += 100;
        } else if (obj.type === 'bomb') {
          lifeChange += 1;
        }
        return false; 
      }
      return true;
    });

    if (scoreChange > 0) setScore(prev => prev + scoreChange);
    
    if (lifeChange > 0) {
      setLives(prev => {
        const nextLives = prev - lifeChange;
        if (nextLives <= 0) {
          sendScoreToBackend(score);
          setCurrentScreen('gameOver');
          return 0;
        }
        return nextLives;
      });
    }

    setSpawnedObjects(remaining);
  }

  return (
    <GameContext.Provider value={{
      presets,
      activePreset,
      setActivePreset,
      currentScreen,
      setCurrentScreen,
      score,
      lives,
      timeLeft,
      spawnedObjects,
      highScore,
      range,
      handleCoefficientSlider,
      startGameplay,
      fireEquationStrike
    }}>
      {children}
    </GameContext.Provider>
  );
}
