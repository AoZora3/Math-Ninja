import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GameContext } from '../../Context/GameContext.jsx';
import Combo from '../../Components/Combo.jsx';
import Timer from '../../Components/Timer.jsx';
import StageResult from '../StageResult/StageResult.jsx';
import { GAME_DURATION_SECONDS, GOAL_SCORE } from '../../Context/GameContext.jsx';
import { getTrigonometricEquation } from '../../Game/Equations/EquationText.js';
import { getStage3Equation } from '../../Game/Equations/Stage3Equation.js';
import appleSprite from '../../Assets/Sprites/Apple_Sprite.png';
import appleSlicedSprite from '../../Assets/Sprites/Apple_Sliced_Sprite.png';
import bombExplosionSprite from '../../Assets/Sprites/Bomb_Explosion_Sprite.png';
import bombSprite from '../../Assets/Sprites/Bomb_Sprite.png';
import AppleRain from './AppleRain.jsx';
import '../../Assets/Styles/Gameplay.css';

const POLYNOMIAL_TYPE_CYCLE = ['linear', 'quadratic', 'cubic'];

function getEquationText(preset) {
  if (!preset) return 'y = 0';
  const { a = 0, b = 0, h = 0, k = 0, l = 1 } = preset.coefficients || {};
  const inversePrefix = preset.inverse ? '-' : '';

  if (preset.type === 'quadratic') {
    return `y = ${a}x² ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
  }

  // Render cubic presets with the same coefficients used by their graph function.
  if (preset.type === 'cubic') {
    return `y = ${a}x³ ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
  }

  if (preset.type === 'trigonometric') {
    return getTrigonometricEquation(preset);
  }

  if (preset.type === 'exponential' && preset.inverseFn) {
    return getStage3Equation(preset, Boolean(preset.inverse));
  }

  if (preset.type === 'exponential') {
    if (preset.formulaKind === 'logistic') {
      return `y = ${inversePrefix}${l} / (1 + e^(-${b}(x - ${h})))`;
    }

    if (preset.formulaKind === 'arch') {
      return `y = ${inversePrefix}${a}(e^(${b}(x - ${h})) + e^(-${b}(x - ${h}))) + ${k}`;
    }

    return `y = ${inversePrefix}${a}e^(-${b}(x - ${h})) + ${k}`;
  }

  return `y = ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
}

function buildCurvePoints(preset, width = 320, height = 260) {
  if (!preset || typeof preset.fn !== 'function') return '';

  const points = [];
  for (let x = -10; x <= 10; x += 0.2) {
    const y = preset.fn(x, preset.coefficients || {});
    if (!Number.isFinite(y)) continue;
    const px = ((x + 10) / 20) * width;
    const py = height - ((y + 10) / 20) * height;
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }

  return points.join(' ');
}

export default function Gameplay({ onBack, onWin }) {
  const {
    presets,
    activePreset,
    setActivePreset,
    score,
    lives,
    timeLeft,
    isPaused,
    setIsPaused,
    hitRate,
    comboMultiplier,
    streak,
    spawnedObjects,
    fireEquationStrike,
    startGameplay,
    handleCoefficientSlider
  } = useContext(GameContext);

  const [selectedPresetId, setSelectedPresetId] = useState(activePreset?.id || presets[0]?.id || null);
  const [firedEquation, setFiredEquation] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isInverted, setIsInverted] = useState(false);
  const winHandled = useRef(false);
  const [slicedFruitObjects, setSlicedFruitObjects] = useState([]);
  const [explodedBombObjects, setExplodedBombObjects] = useState([]);
  const slicedFruitTimeouts = useRef(new Set());
  const resultState = lives <= 0 || timeLeft <= 0 ? 'lost' : score >= GOAL_SCORE ? 'won' : null;

  // Notify progression once per successful run, including after a retry.
  useEffect(() => {
    if (resultState !== 'won') {
      winHandled.current = false;
      return;
    }

    if (!winHandled.current) {
      winHandled.current = true;
      onWin?.();
    }
  }, [resultState, onWin]);

  // Clear temporary slice/explosion timers when Gameplay unmounts.
  useEffect(() => () => {
    slicedFruitTimeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
  }, []);

  useEffect(() => {
    if (!firedEquation) return undefined;

    const timeoutId = window.setTimeout(() => {
      setFiredEquation(null);
      setIsPreviewVisible(true);
    }, 820);
    return () => window.clearTimeout(timeoutId);
  }, [firedEquation]);

  useEffect(() => {
    if (!selectedPresetId && presets[0]) {
      setSelectedPresetId(presets[0].id);
    }
  }, [presets, selectedPresetId]);

  const activeWeapon = useMemo(() => {
    const current = presets.find((preset) => preset.id === selectedPresetId) || activePreset || presets[0];
    return current || null;
  }, [presets, selectedPresetId, activePreset]);

  const effectiveWeapon = useMemo(() => {
    if (!activeWeapon || activeWeapon.type !== 'exponential') {
      return activeWeapon;
    }

    if (activeWeapon.inverseFn) {
      return {
        ...activeWeapon,
        inverse: isInverted,
        fn: isInverted ? activeWeapon.inverseFn : activeWeapon.fn
      };
    }

    return {
      ...activeWeapon,
      inverse: isInverted,
      fn: (x, coeffs = activeWeapon.coefficients || {}) => {
        const baseValue = activeWeapon.fn(x, coeffs);
        return Number.isFinite(baseValue) ? (isInverted ? -baseValue : baseValue) : baseValue;
      }
    };
  }, [activeWeapon, isInverted]);

  useEffect(() => {
    if (activeWeapon) {
      setActivePreset(activeWeapon);
    }
  }, [activeWeapon, setActivePreset]);

  const handleFireEquation = (preset) => {
    if (resultState || isPaused) return;

    const chosen = preset || effectiveWeapon || activeWeapon;
    if (!chosen) return;

    setSelectedPresetId(chosen.id);
    setActivePreset(chosen);
    setIsPreviewVisible(false);
    setFiredEquation((current) => ({
      preset: chosen,
      id: (current?.id || 0) + 1
    }));
    const { slicedFruits = [], explodedBombs = [] } = fireEquationStrike(chosen) || {};
    if (slicedFruits.length > 0) {
      setSlicedFruitObjects((current) => [...current, ...slicedFruits]);
      const slicedFruitIds = new Set(slicedFruits.map((fruit) => fruit.id));
      const timeoutId = window.setTimeout(() => {
        setSlicedFruitObjects((current) => current.filter((fruit) => !slicedFruitIds.has(fruit.id)));
        slicedFruitTimeouts.current.delete(timeoutId);
      }, 500);
      slicedFruitTimeouts.current.add(timeoutId);
    }
    if (explodedBombs.length > 0) {
      setExplodedBombObjects((current) => [...current, ...explodedBombs]);
      const explodedBombIds = new Set(explodedBombs.map((bomb) => bomb.id));
      const timeoutId = window.setTimeout(() => {
        setExplodedBombObjects((current) => current.filter((bomb) => !explodedBombIds.has(bomb.id)));
        slicedFruitTimeouts.current.delete(timeoutId);
      }, 500);
      slicedFruitTimeouts.current.add(timeoutId);
    }
  };

  const handlePreviewEquation = (preset) => {
    setSelectedPresetId(preset.id);
    setActivePreset(preset);
    setIsInverted(false);
    setIsPreviewVisible(true);
  };

  const switchEquationType = () => {
    const availableTypes = POLYNOMIAL_TYPE_CYCLE.filter((type) =>
      presets.some((preset) => preset.type === type)
    );
    if (availableTypes.length < 2) return;

    const currentIndex = availableTypes.indexOf(activeWeapon?.type);
    const nextType = availableTypes[(currentIndex + 1) % availableTypes.length];
    const nextPreset = presets.find((preset) => preset.type === nextType);
    if (nextPreset) handlePreviewEquation(nextPreset);
  };

  const availablePolynomialTypes = POLYNOMIAL_TYPE_CYCLE.filter((type) =>
    presets.some((preset) => preset.type === type)
  );
  const nextPolynomialType = availablePolynomialTypes[
    (availablePolynomialTypes.indexOf(activeWeapon?.type) + 1) % availablePolynomialTypes.length
  ];

  const handleRetry = () => {
    startGameplay();
    setSelectedPresetId((activePreset?.id || presets[0]?.id) || null);
  };

  const liveCurvePoints = buildCurvePoints(effectiveWeapon || activeWeapon || presets[0], 320, 260);
  const firedCurvePoints = buildCurvePoints(firedEquation?.preset, 320, 260);

  if (resultState) {
    return (
      <StageResult
        won={resultState === 'won'}
        score={score}
        lives={lives}
        hitRate={hitRate}
        elapsedSeconds={GAME_DURATION_SECONDS - timeLeft}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="gameplay-shell">
      {isPaused && (
        <div className="result-screen pause-screen">
          <section className="result-panel pause-panel" role="dialog" aria-modal="true" aria-labelledby="pause-title">
            <p className="result-kicker">GAME PAUSED</p>
            <h1 id="pause-title">Paused</h1>
            <p className="result-message">Your current run is saved until you leave.</p>
            <div className="result-actions">
              <button type="button" className="result-button secondary" onClick={onBack}>Leave</button>
              <button type="button" className="result-button primary" onClick={() => setIsPaused(false)}>Continue</button>
            </div>
          </section>
        </div>
      )}
      <AppleRain />
      <header className="gameplay-topbar">
        <div className="score-block">
          <span className="hud-label">SCORE</span>
          <strong>{score}/{GOAL_SCORE}</strong>
        </div>

        <div className="gameplay-metrics">
          <Timer mode="countdown" seconds={timeLeft} />
          <Timer mode="countup" seconds={GAME_DURATION_SECONDS - timeLeft} />
          <Combo multiplier={comboMultiplier} streak={streak} />
        </div>

        <div className="health-block" aria-label="Health">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className={`health-icon ${index < lives ? 'filled' : 'empty'}`}
              aria-hidden="true"
            />
          ))}
        </div>

        <button type="button" className="back-small-btn" onClick={() => setIsPaused(true)}>
          Pause
        </button>
      </header>

      <section className="gameplay-board-panel">
        <div className="gameplay-board">
          <svg className="graph-svg" viewBox="0 0 320 260" preserveAspectRatio="none" aria-label="Gameplay graph">
            <defs>
              <linearGradient id="slash-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="320" y2="0">
                <stop offset="0%" stopColor="#ff304f" stopOpacity="0" />
                <stop offset="55%" stopColor="#ff304f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ff304f" stopOpacity="1" />
              </linearGradient>
            </defs>
            <g>
              {Array.from({ length: 11 }).map((_, index) => {
                const x = (index / 10) * 320;
                const y = (index / 10) * 260;
                return (
                  <g key={`grid-${index}`}>
                    <line x1={x} y1={0} x2={x} y2={260} stroke="#2c3a4d" strokeWidth="1" />
                    <line x1={0} y1={y} x2={320} y2={y} stroke="#2c3a4d" strokeWidth="1" />
                  </g>
                );
              })}

              <line x1="0" y1="130" x2="320" y2="130" stroke="#dfe7f3" strokeWidth="2" />
              <line x1="160" y1="0" x2="160" y2="260" stroke="#dfe7f3" strokeWidth="2" />

              {firedCurvePoints ? (
                <polyline
                  key={firedEquation.id}
                  points={firedCurvePoints}
                  pathLength="1"
                  fill="none"
                  stroke="url(#slash-fade)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`fired-curve ${firedEquation.preset.type}-fired`}
                  onAnimationEnd={() => setIsPreviewVisible(true)}
                />
              ) : null}
              {liveCurvePoints && isPreviewVisible ? (
                <polyline
                  points={liveCurvePoints}
                  fill="none"
                  stroke="#56e39f"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="live-curve"
                />
              ) : null}
            </g>
          </svg>

          {[
            ...spawnedObjects.map((obj) => ({ obj, isSliced: false })),
            ...slicedFruitObjects.map((obj) => ({ obj, isSliced: true, isExploded: false })),
            ...explodedBombObjects.map((obj) => ({ obj, isSliced: false, isExploded: true }))
          ].map(({ obj, isSliced, isExploded = false }) => {
            const isFruit = obj.type === 'fruit';
            const left = ((obj.x + 10) / 20) * 100;
            const top = 100 - ((obj.y + 10) / 20) * 100;
            const targetName = isSliced ? 'Sliced fruit' : isExploded ? 'Bomb explosion' : isFruit ? 'Fruit' : 'Bomb';

            return (
              <div
                key={obj.id}
                className={`spawned-target ${isFruit ? 'fruit' : 'bomb'}${isSliced ? ' sliced' : ''}${isExploded ? ' exploded' : ''}`}
                style={{ left: `${left}%`, top: `${top}%` }}
                title={targetName}
                role="img"
                aria-label={targetName}
              >
                {isSliced || isExploded ? (
                  <img
                    src={isSliced ? appleSlicedSprite : bombExplosionSprite}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                  />
                ) : isFruit ? (
                  <img src={appleSprite} alt="" aria-hidden="true" draggable="false" />
                ) : (
                  <img src={bombSprite} alt="" aria-hidden="true" draggable="false" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="equation-controls" aria-label="Equation controls">
        <div className="control-heading">
          <div className="live-equation">
            <span className="hud-label">LIVE EQUATION: </span>
            <h2>{getEquationText(effectiveWeapon || activeWeapon)}</h2>
          </div>
        </div>

        <div className="slider-list">
          {activeWeapon && Object.keys(activeWeapon.coefficients || {}).map((key) => {
            const [min, max] = activeWeapon.minMax?.[key] || [-10, 10];
            const value = activeWeapon.coefficients[key];
            return (
              <label className="coefficient-slider" key={key}>
                <span><b>{key}</b><output>{value}</output></span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="0.1"
                  value={value}
                  onChange={(event) => handleCoefficientSlider(activeWeapon.id, key, Number(event.target.value))}
                />
              </label>
            );
          })}
        </div>
        <div className="equation-action-row">
          {activeWeapon?.type === 'exponential' ? (
            <button type="button" className="type-switch" onClick={() => setIsInverted((prev) => !prev)}>
              {isInverted ? 'Use normal curve' : 'Invert curve'}
            </button>
          ) : (
            <button type="button" className="type-switch" onClick={switchEquationType}>
              Switch to {activeWeapon?.type === 'linear' ? 'quadratic' : 'linear'}
            </button>
          )}

          <button type="button" className="fire-button" onClick={() => handleFireEquation(effectiveWeapon || activeWeapon)} disabled={!activeWeapon || Boolean(resultState)}>
            Fire equation
          </button>
        </div>
      </section>

      <section className="gameplay-hotbar">
        <div className="hotbar-header">
          <span>HOTBAR</span>
          <span>Choose a curve to preview</span>
        </div>

        <div className="hotbar-grid">
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <div className={`hotbar-entry ${isSelected ? 'selected' : ''}`} key={preset.id}>
                <button type="button" className="hotbar-button" onClick={() => handlePreviewEquation(preset)}>
                  <span>{preset.type}</span>
                  {getEquationText(preset)}
                </button>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
