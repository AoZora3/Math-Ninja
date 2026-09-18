import { useContext, useEffect, useMemo, useState } from 'react';
import { GameContext } from '../../Context/GameContext.jsx';

function getEquationText(preset) {
  if (!preset) return 'y = 0';
  return preset.equation || (preset.type === 'quadratic' ? 'y = ax² + b' : 'y = ax + b');
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

export default function Gameplay({ onBack }) {
  const {
    presets,
    activePreset,
    setActivePreset,
    score,
    lives,
    spawnedObjects,
    fireEquationStrike,
    startGameplay,
    setCurrentScreen
  } = useContext(GameContext);

  const [selectedPresetId, setSelectedPresetId] = useState(activePreset?.id || presets[0]?.id || null);
  const resultState = score >= 100 ? 'stageComplete' : lives <= 0 ? 'gameOver' : null;

  useEffect(() => {
    if (!selectedPresetId && presets[0]) {
      setSelectedPresetId(presets[0].id);
    }
  }, [presets, selectedPresetId]);

  const activeWeapon = useMemo(() => {
    const current = presets.find((preset) => preset.id === selectedPresetId) || activePreset || presets[0];
    return current || null;
  }, [presets, selectedPresetId, activePreset]);

  useEffect(() => {
    if (activeWeapon) {
      setActivePreset(activeWeapon);
    }
  }, [activeWeapon, setActivePreset]);

  const handleFireEquation = (preset) => {
    if (resultState) return;

    const chosen = preset || activeWeapon;
    if (!chosen) return;

    setSelectedPresetId(chosen.id);
    setActivePreset(chosen);
    fireEquationStrike(chosen);
  };

  const handleRetry = () => {
    startGameplay();
    setSelectedPresetId((activePreset?.id || presets[0]?.id) || null);
  };

  const curvePoints = buildCurvePoints(activeWeapon || presets[0], 320, 260);

  return (
    <div className="gameplay-shell">
      <header className="gameplay-topbar">
        <div className="score-block">
          <span className="hud-label">SCORE</span>
          <strong>{score}/100</strong>
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

        <button type="button" className="back-small-btn" onClick={onBack}>
          Back
        </button>
      </header>

      <section className="gameplay-board-panel">
        <div className="equation-badge">{getEquationText(activeWeapon)}</div>

        <div className="gameplay-board">
          <svg className="graph-svg" viewBox="0 0 320 260" preserveAspectRatio="xMidYMid meet" aria-label="Gameplay graph">
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

              {curvePoints ? (
                <polyline
                  points={curvePoints}
                  fill="none"
                  stroke="#ffcc33"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </g>
          </svg>

          {spawnedObjects.map((obj) => {
            const isFruit = obj.type === 'fruit';
            const left = ((obj.x + 10) / 20) * 100;
            const top = 100 - ((obj.y + 10) / 20) * 100;

            return (
              <div
                key={obj.id}
                className={`spawned-target ${isFruit ? 'fruit' : 'bomb'}`}
                style={{ left: `${left}%`, top: `${top}%` }}
                title={isFruit ? 'Apple' : 'Bomb'}
              >
                {isFruit ? '🍎' : '💣'}
              </div>
            );
          })}
        </div>
      </section>

      <section className="gameplay-hotbar">
        <div className="hotbar-header">
          <span>HOTBAR</span>
          <span>Tap to fire</span>
        </div>

        <div className="hotbar-grid">
          {presets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                className={`hotbar-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleFireEquation(preset)}
              >
                {preset.equation || 'y = x'}
              </button>
            );
          })}
        </div>
      </section>

      {resultState && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: 16
        }}>
          <div style={{
            width: '100%',
            maxWidth: 360,
            background: '#111827',
            border: '1px solid #334155',
            borderRadius: 18,
            padding: 24,
            textAlign: 'center',
            color: '#f8fafc'
          }}>
            <h2 style={{ fontSize: 32, marginBottom: 8 }}>
              {resultState === 'stageComplete' ? 'Stage Complete!' : 'Game Over'}
            </h2>
            <p style={{ marginBottom: 18, color: '#cbd5e1' }}>
              {resultState === 'stageComplete'
                ? `You reached ${score}/100 points.`
                : `You ran out of hearts.`}
            </p>

            <button
              type="button"
              onClick={() => {
                setCurrentScreen('splash');
                onBack();
              }}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: '#facc15',
                color: '#111827',
                fontWeight: 800,
                marginRight: 8,
                cursor: 'pointer'
              }}
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleRetry}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                background: '#22c55e',
                color: '#052e16',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

