import React, { createContext, useState, useEffect, useRef } from 'react';
import { checkEquationSlice } from '../Game/Collision.js';
import { stage1Presets } from '../Game/Equations/StagePreset1.js';
import backgroundMusic from '../Assets/SoundEffects/MathNinjaBGM.mp3';

export const GameContext = createContext(null);
const MAX_OBJECTS_PER_TYPE = 6; // Limit active fruit and bombs independently.
const OBJECT_LIFETIME_MS = 5000; // Despawn each object after about five seconds.
const DESPAWN_CHECK_INTERVAL_MS = 250; // Check often so expiry stays close to five seconds.

export function GameProvider({ children }) {
  const [presets, setPresets] = useState(stage1Presets);
  const [activePreset, setActivePreset] = useState(stage1Presets[0]);
  const [currentScreen, setCurrentScreen] = useState('splash');

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [lives, setLives] = useState(3);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [spawnedObjects, setSpawnedObjects] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [musicVolume, setMusicVolume] = useState(50);
  const backgroundMusicRef = useRef(null);

  const range = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  function startBackgroundMusic() {
    const playback = backgroundMusicRef.current?.play();
    if (playback) {
      playback.catch(error => {
        console.error('Unable to play background music.', error);
      });
    }
  }

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
    scoreRef.current = 0;
    setLives(3);
    setComboMultiplier(1);
    setStreak(0);
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
          const finalScore = scoreRef.current;
          sendScoreToBackend(finalScore);
          setCurrentScreen(finalScore >= 100 ? 'stageComplete' : 'gameOver');
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
      setSpawnedObjects(prev => {
        const activeObjects = prev.filter(obj => Date.now() - obj.spawnTime < OBJECT_LIFETIME_MS); // Drop expired objects during spawning too.
        const sameTypeCount = activeObjects.filter(obj => obj.type === newObject.type).length;
        return sameTypeCount >= MAX_OBJECTS_PER_TYPE ? activeObjects : [...activeObjects, newObject]; // Keep at most six of each type.
      });
    }, 1500);

    const despawnTimer = setInterval(() => {
      setSpawnedObjects(prev => prev.filter(obj => Date.now() - obj.spawnTime < OBJECT_LIFETIME_MS)); // Despawn objects once they reach five seconds old.
    }, DESPAWN_CHECK_INTERVAL_MS);

    return () => {
      clearInterval(clockTimer);
      clearInterval(spawnerTimer);
      clearInterval(despawnTimer); // Stop despawn checks when gameplay ends.
    };
  }, [currentScreen]);

  // Fire Equation
  function fireEquationStrike(selectedPreset = activePreset) {
    let scoreChange = 0;
    let lifeChange = 0;
    let fruitHits = 0;

    const remaining = spawnedObjects.filter(obj => {
      const isHit = checkEquationSlice(obj, selectedPreset);

      if (isHit) {
        if (obj.type === 'fruit') {
          fruitHits += 1;
          scoreChange += 10;
        } else if (obj.type === 'bomb') {
          lifeChange += 1;
        }
        return false;
      }
      return true;
    });

    if (lifeChange > 0 || fruitHits === 0) {
      setComboMultiplier(1);
      setStreak(0);
    } else {
      const nextStreak = streak + fruitHits;
      setStreak(nextStreak);
      setComboMultiplier(nextStreak >= 6 ? 3 : nextStreak >= 3 ? 2 : 1);
    }

    const awardedScore = scoreChange * comboMultiplier;
    if (awardedScore > 0) {
      setScore(prev => {
        const nextScore = prev + awardedScore;
        scoreRef.current = nextScore;
        if (nextScore >= 100) {
          sendScoreToBackend(nextScore);
          setCurrentScreen('stageComplete');
        }
        return nextScore;
      });
    }

    if (lifeChange > 0) {
      setLives(prev => {
        const nextLives = prev - lifeChange;
        if (nextLives <= 0) {
          sendScoreToBackend(scoreRef.current);
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
      setPresets,
      activePreset,
      setActivePreset,
      currentScreen,
      setCurrentScreen,
      score,
      lives,
      timeLeft,
      comboMultiplier,
      streak,
      spawnedObjects,
      highScore,
      musicVolume,
      setMusicVolume,
      startBackgroundMusic,
      range,
      handleCoefficientSlider,
      startGameplay,
      fireEquationStrike
    }}>
      {children}
      <audio
        ref={backgroundMusicRef}
        src={backgroundMusic}
        loop
        preload="auto"
      />
    </GameContext.Provider>
  );
}
