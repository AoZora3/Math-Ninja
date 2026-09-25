import React, { useEffect, useState } from 'react';
import Timer from '../../components/Timer';
import Combo from '../../components/Combo';
import { useGameContext } from '../../context/GameContext';

const weapons = ['y = x', 'y = 2x - 4', 'y = -x + 5', 'y = x² - 2', 'y = 0.5x + 1', 'y = -x² + 4'];
const COLLISION_TOLERANCE = 0.5;

function isTargetHit(equation, target, xVariable, yVariable) {
  for (let xOffset = -COLLISION_TOLERANCE; xOffset <= COLLISION_TOLERANCE; xOffset += 0.1) {
    const curveY = evaluate(equation, target.x + xVariable + xOffset) + yVariable;
    if (Number.isFinite(curveY) && Math.abs(curveY - target.y) <= COLLISION_TOLERANCE) return true;
  }
  return false;
}

function randomTarget(type) {
  return {
    id: `${type}-${Date.now()}-${Math.random()}`,
    type,
    x: Number((Math.random() * 14 - 7).toFixed(1)),
    y: Number((Math.random() * 14 - 7).toFixed(1)),
  };
}

function createTargets() {
  return [randomTarget('apple'), randomTarget('apple'), randomTarget('bomb')];
}

function evaluate(formula, x) {
  const expression = formula.replace(/^y\s*=\s*/i, '').replaceAll(' ', '');
  const constantTotal = (constants) =>
    (constants || '').match(/[+-]?\d+(?:\.\d+)?/g)?.reduce((sum, value) => sum + Number(value), 0) || 0;

  const sineMatch = expression.match(/^([+-]?(?:\d+(?:\.\d+)?)?)sin\(x\)((?:[+-]\d+(?:\.\d+)?)+)?$/i);
  if (sineMatch)
    return (sineMatch[1] === '-' ? -1 : Number(sineMatch[1] || 1)) * Math.sin(x) + constantTotal(sineMatch[2]);

  const quadraticMatch = expression.match(/^(-?)(\d+(?:\.\d+)?)?x²((?:[+-]\d+(?:\.\d+)?)+)?$/i);
  if (quadraticMatch)
    return (quadraticMatch[1] === '-' ? -1 : 1) * Number(quadraticMatch[2] || 1) * x * x + constantTotal(quadraticMatch[3]);

  const linearMatch = expression.match(/^(-?)(\d+(?:\.\d+)?)?x((?:[+-]\d+(?:\.\d+)?)+)?$/i);
  if (linearMatch)
    return (linearMatch[1] === '-' ? -1 : 1) * Number(linearMatch[2] || 1) * x + constantTotal(linearMatch[3]);

  return Number(expression);
}

function GameGraph({ equation, targets, xVariable, yVariable }) {
  const range = 8;
  const point = (x, y) => ({
    x: 20 + ((x + range) / (range * 2)) * 360,
    y: 20 + ((range - y) / (range * 2)) * 300,
  });

  const curve = Array.from({ length: 161 }, (_, index) => {
    const x = -range + index / 10;
    const y = evaluate(equation, x + xVariable) + yVariable;
    return Number.isFinite(y) && Math.abs(y) <= range ? point(x, y) : null;
  });

  const path = curve.reduce((result, current) => {
    if (!current) return result;
    return `${result}${result && !result.endsWith('M') ? 'L' : 'M'} ${current.x.toFixed(1)} ${current.y.toFixed(1)} `;
  }, '');

  return (
    <svg className="game-graph" viewBox="0 0 400 340" role="img" aria-label="Gameplay graph">
      <rect width="400" height="340" className="graph-background" />
      {Array.from({ length: 9 }, (_, index) => {
        const offset = 20 + index * 45;
        return (
          <g key={offset}>
            <line x1={offset} y1="20" x2={offset} y2="320" className="graph-grid-line" />
            <line x1="20" y1={offset} x2="380" y2={offset} className="graph-grid-line" />
          </g>
        );
      })}
      <line x1="20" y1="170" x2="380" y2="170" className="graph-axis" />
      <line x1="200" y1="20" x2="200" y2="320" className="graph-axis" />
      <path d={path} className="graph-curve" />
      {targets.map((target) => {
        const position = point(target.x, target.y);
        return (
          <text key={target.id} x={position.x} y={position.y + 12} className="graph-target">
            {target.type === 'bomb' ? '💣' : '🍎'}
          </text>
        );
      })}
    </svg>
  );
}

export default function Gameplay({ setScreen, initialEquation }) {
  const {
    score,
    setScore,
    lives,
    setLives,
    comboMultiplier,
    streak,
    recordSliceAttempt,
    getHitRate,
    setCountUpTime,
    setCountDownTime,
    resetGameStats,
  } = useGameContext();

  const [activeWeapon, setActiveWeapon] = useState(initialEquation || weapons[0]);
  const [xVariable, setXVariable] = useState(0);
  const [yVariable, setYVariable] = useState(0);
  const [targets, setTargets] = useState(createTargets);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  // Handle countdown expiry
  const handleTimeUp = () => {
    setGameOver(true);
    setMessage('TIME EXPIRED!');
  };

  // Evaluate collisions and update backend hit-rate + combo stats
  useEffect(() => {
    if (gameOver) return undefined;

    const collisionDelay = setTimeout(() => {
      const hits = targets.filter((target) => isTargetHit(activeWeapon, target, xVariable, yVariable));
      if (!hits.length) return;

      const bombHits = hits.filter((target) => target.type === 'bomb').length;
      const fruitHits = hits.filter((target) => target.type === 'apple').length;

      // 1. Record slice metrics in context (calculates hit-rate in backend)
      recordSliceAttempt({ fruitHits, bombHits });

      // 2. Handle bomb penalty
      if (bombHits > 0) {
        setLives((prev) => {
          const next = Math.max(0, prev - 1);
          if (next === 0) setGameOver(true);
          return next;
        });
        setMessage('BOMB SLICED! COMBO RESET & -1 HEART');
      } 
      // 3. Handle score addition with combo multiplier
      else if (fruitHits > 0) {
        setScore((prev) => {
          const addedPoints = fruitHits * 5 * comboMultiplier;
          const nextScore = prev + addedPoints;
          if (nextScore >= 100) setGameOver(true);
          return nextScore;
        });
        setMessage(`SAFE SLICE! +${fruitHits * 5 * comboMultiplier} PTS`);
      }

      // 4. Refill targets
      const remaining = targets.filter((target) => !hits.includes(target));
      setTargets([
        ...remaining,
        ...Array.from({ length: fruitHits }, () => randomTarget('apple')),
        ...Array.from({ length: bombHits }, () => randomTarget('bomb')),
      ]);
    }, 2000);

    return () => clearTimeout(collisionDelay);
  }, [activeWeapon, comboMultiplier, gameOver, recordSliceAttempt, setLives, setScore, targets, xVariable, yVariable]);

  const restart = () => {
    resetGameStats();
    setTargets(createTargets());
    setMessage('');
    setGameOver(false);
  };

  return (
    <div className="gameplay-screen screen">
      <header className="gameplay-header" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="back-button" onClick={() => setScreen('stage1')}>←</button>
        <div><span>SCORE: </span><strong>{score} / 100</strong></div>
        
        {/* Countup Timer */}
        <Timer mode="countup" isActive={!gameOver} onTick={setCountUpTime} />

        {/* Countdown Timer */}
        <Timer mode="countdown" initialTime={60} isActive={!gameOver} onTimeUp={handleTimeUp} onTick={setCountDownTime} />

        {/* Combo Multiplier UI */}
        <Combo multiplier={comboMultiplier} streak={streak} />

        <div className="gameplay-lives">{'♥'.repeat(lives)}{'♡'.repeat(3 - lives)}</div>
      </header>

      <main className="gameplay-main">
        <div className="gameplay-status">{message || `ACTIVE: ${activeWeapon}`}</div>

        <GameGraph equation={activeWeapon} targets={targets} xVariable={xVariable} yVariable={yVariable} />

        {gameOver && (
          <div className="gameover-panel">
            <strong>{score >= 100 ? 'STAGE CLEAR!' : 'GAME OVER'}</strong>
            <span>FINAL SCORE: {score}</span>
            {/* Hit rate calculated via backend fn getHitRate() for end screens */}
            <span>ACCURACY (BACKEND): {getHitRate()}%</span>
            <button className="select-button" onClick={restart}>RESTART</button>
          </div>
        )}

        <section className="weapon-panel">
          <label className="variable-control" htmlFor="x-variable">
            <span>X VALUE <strong>{xVariable > 0 ? '+' : ''}{xVariable.toFixed(1)}</strong></span>
            <input id="x-variable" type="range" min="-10" max="10" step="0.1" value={xVariable} onChange={(e) => setXVariable(Number(e.target.value))} />
          </label>
          <label className="variable-control" htmlFor="y-variable">
            <span>Y VALUE <strong>{yVariable > 0 ? '+' : ''}{yVariable.toFixed(1)}</strong></span>
            <input id="y-variable" type="range" min="-10" max="10" step="0.1" value={yVariable} onChange={(e) => setYVariable(Number(e.target.value))} />
          </label>
          <div className="weapon-grid">
            {weapons.map((w) => (
              <button key={w} className={w === activeWeapon ? 'weapon active' : 'weapon'} onClick={() => setActiveWeapon(w)} disabled={gameOver}>
                {w}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}