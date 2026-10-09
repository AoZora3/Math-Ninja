import React, { createContext, useState, useEffect, useRef } from 'react';
import { checkEquationSlice } from '../Game/Collision.js';
import { stage1Presets } from '../Game/Equations/StagePreset1.js';
import backgroundMusic from '../Assets/SoundEffects/BGM.mp3';
import gameplayMusic from '../Assets/SoundEffects/BGGM.mp3';
import bombSound from '../Assets/SoundEffects/Bomb.mp3';
import clickSound from '../Assets/SoundEffects/Click.mp3';
import presetSelectSound from '../Assets/SoundEffects/PresetSelect.mp3';
import sliceHitSound from '../Assets/SoundEffects/SliceHit.mp3';
import sliceMissSound from '../Assets/SoundEffects/SliceMiss.mp3';


export const GameContext = createContext(null);
export const GAME_DURATION_SECONDS = 180;
export const GOAL_SCORE = 100;
const MAX_OBJECTS_PER_TYPE = 6; // Limit active fruit and bombs independently.
const OBJECT_LIFETIME_MS = 5000; // Despawn each object after about five seconds.
const DESPAWN_CHECK_INTERVAL_MS = 250; // Check often so expiry stays close to five seconds.

function playSoundEffect(sound) {
  const audio = new Audio(sound);
  audio.volume = 0.7;
  const playback = audio.play();
  playback?.catch(() => {});
}

export function GameProvider({ children }) {
  const [presets, setPresets] = useState(stage1Presets);
  const [activePreset, setActivePreset] = useState(stage1Presets[0]);
  const [currentScreen, setCurrentScreen] = useState('splash');

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [lives, setLives] = useState(3);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [equationStats, setEquationStats] = useState({ attempts: 0, hits: 0 });
  const [spawnedObjects, setSpawnedObjects] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [musicVolume, setMusicVolume] = useState(50);
  const [musicStarted, setMusicStarted] = useState(false);
  const backgroundMusicRef = useRef(null);

  const [isEndless, setIsEndless] = useState(false);
  const [difficultyTier, setDifficultyTier] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);

  const range = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

  useEffect(() => {
    if (!musicStarted) return;

    const audio = backgroundMusicRef.current;
    if (!audio) return;

    const playback = audio.play();
    playback?.catch(() => {});
  }, [currentScreen, musicStarted]);

  function startBackgroundMusic() {
    setMusicStarted(true);
    const playback = backgroundMusicRef.current?.play();
    if (playback) {
        playback.catch(() => {});
      
    }
  }

   useEffect(() => {
    const handleMenuButtonClick = event => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      if (!button || button.closest('.gameplay-shell')) return;

      const label = button.textContent?.trim().toLowerCase() || '';
      playSoundEffect(label.startsWith('continue') ? presetSelectSound : clickSound);
    };

    document.addEventListener('click', handleMenuButtonClick, true);
    return () => document.removeEventListener('click', handleMenuButtonClick, true);
  }, []);

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
    setTimeLeft(GAME_DURATION_SECONDS);
    setEquationStats({ attempts: 0, hits: 0 });
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
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(clockTimer);
          const finalScore = scoreRef.current;
          sendScoreToBackend(finalScore);
          setCurrentScreen(finalScore >= GOAL_SCORE ? 'stageComplete' : 'gameOver');
          return 0;
        }
        return prev - 1;
      });
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
  }, [currentScreen, isEndless, elapsedTime]);

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
          const timeBonus = isEndless ? Math.floor(Math.max(0, 5000 - (Date.now() - obj.spawnTime)) / 250) : 0;
          scoreChange += (10 * difficultyTier + timeBonus);
        } else if (obj.type === 'bomb') {
          lifeChange += 1;
        }
        return false;
      }
      return true;
    });

    setEquationStats(prev => ({
      attempts: prev.attempts + 1,
      hits: prev.hits + (fruitHits > 0 ? 1 : 0)
    }));

    if (lifeChange > 0 || fruitHits === 0) {
      setComboMultiplier(1);
      setStreak(0);
    } else {
      const nextStreak = streak + fruitHits;
      setStreak(nextStreak);
      setComboMultiplier(1 + Math.floor(nextStreak / 5));
    }

    if (fruitHits > 0) playSoundEffect(sliceHitSound);
    if (lifeChange > 0) playSoundEffect(bombSound);
    if (fruitHits === 0 && lifeChange === 0) playSoundEffect(sliceMissSound);

    const awardedScore = scoreChange * comboMultiplier;
    if (awardedScore > 0) {
      setScore(prev => {
        const nextScore = prev + awardedScore;
        scoreRef.current = nextScore;
        if (nextScore >= GOAL_SCORE) {
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
      hitRate: equationStats.attempts === 0 ? 0 : (equationStats.hits / equationStats.attempts) * 100,
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
        src={currentScreen === 'gameplay' ? gameplayMusic : backgroundMusic}
        loop
        preload="auto"
      />
    </GameContext.Provider>
  );
}