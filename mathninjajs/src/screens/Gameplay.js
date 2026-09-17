import React, { useMemo, useRef, useState } from 'react';
import { HeartFilled, HeartOutlined, BackArrowIcon, KatanaIcon } from '../components/Icons';
import { Grid, evaluateEquation } from '../components/Grid';

const WEAPON_EQUATIONS = [
  { id: 'w1', formula: 'y = 2x - 4',   label: 'SLOT 1' },
  { id: 'w2', formula: 'y = -x + 5',   label: 'SLOT 2' },
  { id: 'w3', formula: 'y = x² - 2',   label: 'SLOT 3' },
  { id: 'w4', formula: 'y = 3sin(x)',  label: 'SLOT 4' },
  { id: 'w5', formula: 'y = 0.5x + 1', label: 'SLOT 5' },
  { id: 'w6', formula: 'y = -x² + 4',  label: 'SLOT 6' },
];

const INITIAL_TARGETS = [
  { id: 't1', type: 'fruit', x: -3, y: 3, size: 48 },
  { id: 't2', type: 'fruit', x: 2.5, y: -5, size: 48 },
  { id: 't3', type: 'bomb', x: 0, y: 4, size: 44 },
];


const isHit = (formula, target) => {
  const y = evaluateEquation(formula, target.x);
  return !isNaN(y) && Math.abs(y - target.y) <= 0.85;
};

const freshTargets = () => INITIAL_TARGETS.map((t) => ({ ...t, consumed: false }));

export const Gameplay = ({ onBackToEquations }) => {
  const [activeWeaponId, setActiveWeaponId] = useState('w1');
  const [score, setScore] = useState(1250);
  const [combo, setCombo] = useState(4);
  const [lives, setLives] = useState(2);
  const [alertFeedback, setAlertFeedback] = useState(null);
  const [targets, setTargets] = useState(freshTargets);
  const [gameOver, setGameOver] = useState(false);
  const alertTimeoutRef = useRef(null);

  const activeWeapon = WEAPON_EQUATIONS.find((w) => w.id === activeWeaponId) || WEAPON_EQUATIONS[0];

  const visibleTargets = useMemo(() => targets.filter((t) => !t.consumed), [targets]);

  const evaluatedTargets = useMemo(
    () => visibleTargets.map((tgt) => ({ ...tgt, sliced: isHit(activeWeapon.formula, tgt) })),
    [visibleTargets, activeWeapon.formula]
  );

  const showAlert = (text, color, duration) => {
   
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlertFeedback({ text, color });
    alertTimeoutRef.current = setTimeout(() => setAlertFeedback(null), duration);
  };

  const handleFireEquation = (weapon) => {
    if (gameOver) return;
    setActiveWeaponId(weapon.id);

    let hitFruit = false;
    let hitBomb = false;
    const hitIds = [];

    visibleTargets.forEach((tgt) => {
      if (isHit(weapon.formula, tgt)) {
        hitIds.push(tgt.id);
        if (tgt.type === 'bomb') hitBomb = true;
        if (tgt.type === 'fruit') hitFruit = true;
      }
    });

    if (hitIds.length > 0) {
      setTargets((prev) =>
        prev.map((t) => (hitIds.includes(t.id) ? { ...t, consumed: true } : t))
      );
    }

    if (hitBomb) {
      setLives((l) => {
        const next = Math.max(0, l - 1);
        if (next === 0) setGameOver(true);
        return next;
      });
      setCombo(1);
      setScore((s) => Math.max(0, s - 200));
      showAlert('BOMB HIT! -1 HEART', '#ff3b14', 1800);
    } else if (hitFruit) {
      setScore((s) => s + 100 * combo);
      setCombo((c) => c + 1);
      showAlert(`SLICE! +${100 * combo} PTS`, '#00e5ff', 1500);
    }
  };

  const handleRestart = () => {
    setTargets(freshTargets());
    setScore(1250);
    setCombo(4);
    setLives(2);
    setGameOver(false);
    setAlertFeedback(null);
    setActiveWeaponId('w1');
  };

  return (
    <div className="screen gameplay-screen">
      {/* Top Bar HUD */}
      <header className="gameplay-hud">
        <div className="hud-score-block">
          <div className="hud-score-row">
            <span className="hud-score-label">SCORE</span>
            <span className="hud-score-value">{score}</span>
          </div>
          <div className="hud-combo-badge">
            <span className="combo-pulse">⚡</span>
            <span>{combo}x COMBO!</span>
          </div>
        </div>

        <div className="hud-right-group">
          <button
            type="button"
            className="hud-mini-btn"
            onClick={onBackToEquations}
            title="Configure Equation Loadout"
            aria-label="Back to Equations"
          >
            <BackArrowIcon />
          </button>

          <div className="hud-lives-container">
            {Array.from({ length: 3 }).map((_, i) => (
              i < lives ? <HeartFilled key={i} /> : <HeartOutlined key={i} />
            ))}
          </div>
        </div>
      </header>

      {/* Cartesian Plane Area */}
      <section className="gameplay-canvas-area">
        <div className="canvas-header-strip">
          <span className="canvas-badge"></span>
          <span className="weapon-callout">
            {alertFeedback ? (
              <span style={{ color: alertFeedback.color, fontWeight: '800' }}>
                {alertFeedback.text}
              </span>
            ) : (
              <>ACTIVE: <strong className="highlight-eq">{activeWeapon.formula}</strong></>
            )}
          </span>
        </div>

        <div className="canvas-grid-wrapper" style={{ position: 'relative' }}>
          <Grid
            range={8}
            width={345}
            height={320}
            equation={activeWeapon.formula}
            fullBleed={false}
            targets={evaluatedTargets}
          />

          {gameOver && (
            <div className="gameover-overlay">
              <span className="gameover-title">OUT OF HEARTS</span>
              <span className="gameover-score">FINAL SCORE: {score}</span>
              <button type="button" className="btn-cyan-primary" onClick={handleRestart}>
                RESTART
              </button>
            </div>
          )}
        </div>

        <div>
        </div>
      </section>

      <section className="gameplay-hotbar-container">
        <div className="hotbar-header">
          <div className="hotbar-title">
            <KatanaIcon />
          </div>
          <span className="hotbar-meta">TAP TO FIRE</span>
        </div>

        <div className="weapon-hotbar-grid-2x3">
          {WEAPON_EQUATIONS.map((weapon) => {
            const isSelected = weapon.id === activeWeaponId;
            return (
              <button
                key={weapon.id}
                type="button"
                disabled={gameOver}
                className={`weapon-hotbar-btn-large ${isSelected ? 'active-weapon' : ''}`}
                onClick={() => handleFireEquation(weapon)}
              >
                <span className="weapon-formula-large">{weapon.formula}</span>
                {isSelected && <span className="active-dot" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
