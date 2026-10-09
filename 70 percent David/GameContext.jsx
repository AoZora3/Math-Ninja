import React, { createContext, useState, useEffect, useRef } from 'react';
import { checkEquationSlice } from '../Game/Collision.js';
import { stage1Presets } from '../Game/Equations/StagePreset1.js';
import backgroundMusic from '../Assets/SoundEffects/MathNinjaBGM.mp3';

export const GameContext = createContext(null);

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

  const [isEndless, setIsEndless] = useState(false);
  const [difficultyTier, setDifficultyTier] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  function startGameplay(modeIsEndless = false) {
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    setComboMultiplier(1);
    setStreak(0);
    setTimeLeft(45);
    setElapsedTime(0);
    setIsEndless(modeIsEndless);
    setDifficultyTier(1);
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

  const registerMiss = () => {
    setStreak(0);
    setComboMultiplier(1);
    if (isEndless) {
      setLives(prev => {
        const updated = prev - 1;
        if (updated <= 0) {
          sendScoreToBackend(scoreRef.current);
          setCurrentScreen('gameOver');
          return 0;
        }
        return updated;
      });
    }
  };

  useEffect(() => {
    if (currentScreen !== 'gameplay') return;

    const clockTimer = setInterval(() => {
      if (isEndless) {
        setElapsedTime(prev => {
          const nextTime = prev + 1;
          if (nextTime > 90) setDifficultyTier(3);
          else if (nextTime > 30) setDifficultyTier(2);
          return nextTime;
        });
      } else {
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
      }
    }, 1000);

    const spawnInterval = isEndless ? Math.max(500, 1500 - elapsedTime * 10) : 1500;

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
    }, spawnInterval);

    return () => {
      clearInterval(clockTimer);
      clearInterval(spawnerTimer);
    };
  }, [currentScreen, isEndless, elapsedTime]);

  function fireEquationStrike(selectedPreset = activePreset) {
    let scoreChange = 0;
    let lifeChange = 0;
    let fruitHits = 0;

    const remaining = spawnedObjects.filter(obj => {
      const isHit = checkEquationSlice(obj, selectedPreset);

      if (isHit) {
        if (obj.type === 'fruit') {
          fruitHits += 1;
          const timeBonus = isEndless ? Math.floor(Math.max(0, 5000 - (Date.now() - obj.spawnTime)) / 250) : 0;
          scoreChange += (10 * difficultyTier + timeBonus);
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
      setComboMultiplier(1 + Math.floor(nextStreak / 5));
    }

    const awardedScore = scoreChange * comboMultiplier;
    if (awardedScore > 0) {
      setScore(prev => {
        const nextScore = prev + awardedScore;
        scoreRef.current = nextScore;
        if (!isEndless && nextScore >= 100) {
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
      fireEquationStrike,
      isEndless,
      setIsEndless,
      difficultyTier,
      setDifficultyTier,
      elapsedTime,
      registerMiss
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