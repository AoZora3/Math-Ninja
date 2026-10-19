import React, { useMemo, useState } from 'react';

const GRAPH_WIDTH = 320;
const GRAPH_HEIGHT = 220;
const PADDING = 18;
const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = -5;
const Y_MAX = 5;

function sampleCurve(fn, a, b) {
  const points = [];

  for (let x = X_MIN; x <= X_MAX; x += 0.15) {
    const y = fn(x, a, b);
    if (!Number.isFinite(y)) {
      continue;
    }

    const normalizedX = ((x - X_MIN) / (X_MAX - X_MIN)) * (GRAPH_WIDTH - PADDING * 2) + PADDING;
    const normalizedY = GRAPH_HEIGHT - PADDING - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (GRAPH_HEIGHT - PADDING * 2);
    points.push({ x: normalizedX, y: normalizedY });
  }

  return points;
}

function buildLine(points) {
  if (!points.length) return '';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function shuffleOptions(options) {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export default function BuildChallenge({ step, onBack, onComplete, onContinue }) {
  const [options] = useState(() => shuffleOptions(step?.options || []));
  const [aValue, setAValue] = useState(step?.initialCoefficients?.a ?? 1);
  const [bValue, setBValue] = useState(step?.initialCoefficients?.b ?? 0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const targetPoints = useMemo(() => sampleCurve(step?.targetFn || (() => 0), aValue, bValue), [aValue, bValue, step]);
  const selectedOption = options.find((option) => option.id === selectedOptionId);
  const previewPoints = useMemo(
    () => (selectedOption ? sampleCurve(selectedOption.fn, aValue, bValue) : []),
    [selectedOption, aValue, bValue]
  );

  const handleOptionClick = (option) => {
    if (isSolved) {
      return;
    }

    setSelectedOptionId(option.id);
    setIsSolved(option.isCorrect);
    if (option.isCorrect) {
      onComplete(step.unlockedPresetId);
    }
  };

  if (!step) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#110f1d', color: '#f5f1ff', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <button type="button" onClick={onBack} style={{ border: 'none', background: 'transparent', color: '#fff', fontSize: 26, cursor: 'pointer' }}>←</button>
        <h2 style={{ margin: 0, fontSize: 20, letterSpacing: 1.5 }}>BUILD FORMULA</h2>
        <div style={{ width: 30 }} />
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, letterSpacing: 1.8, opacity: 0.7 }}>STEP {step.id}</span>
          <h3 style={{ margin: 0, fontSize: 28 }}>Mathematical reasoning</h3>
          <p style={{ margin: 0, fontSize: 16, opacity: 0.9 }}>{step.prompt}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#1b1730', borderRadius: 18, padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: 16 }}>{step.template}</strong>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Select the expression that satisfies the question.</span>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>a</span>
              <input type="range" min={-3} max={3} step={0.1} value={aValue} onChange={(event) => setAValue(Number(event.target.value))} />
            </label>
            <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>b</span>
              <input type="range" min={-3} max={3} step={0.1} value={bValue} onChange={(event) => setBValue(Number(event.target.value))} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: selectedOption ? 'Target' : 'Target curve', points: targetPoints, color: '#7dd3fc' },
              ...(selectedOption ? [{ label: 'Your choice', points: previewPoints, color: selectedOption.isCorrect ? '#34d399' : '#fca5a5' }] : [])
            ].map((graph) => (
              <div key={graph.label} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.8 }}>{graph.label}</div>
                <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} width="100%" height={220} style={{ background: '#111827', borderRadius: 12 }}>
                  <g stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <line x1={PADDING} y1={GRAPH_HEIGHT / 2} x2={GRAPH_WIDTH - PADDING} y2={GRAPH_HEIGHT / 2} />
                    <line x1={GRAPH_WIDTH / 2} y1={PADDING} x2={GRAPH_WIDTH / 2} y2={GRAPH_HEIGHT - PADDING} />
                  </g>
                  {graph.points.length > 0 && <path d={buildLine(graph.points)} fill="none" stroke={graph.color} strokeWidth="2.5" />}
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option)}
              disabled={isSolved}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: 12,
                border: selectedOptionId === option.id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.18)',
                background: selectedOptionId === option.id && option.isCorrect ? '#103426' : '#211d37',
                color: '#fff',
                cursor: isSolved ? 'default' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{option.label}</strong>
                {selectedOptionId === option.id && option.isCorrect && <span>✓</span>}
              </div>
            </button>
          ))}
        </div>

        {selectedOption && (
          <div style={{ padding: 12, borderRadius: 12, background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{selectedOption.isCorrect ? 'Takeaway' : 'Not quite.'}</div>
            <div style={{ opacity: 0.9 }}>{selectedOption.isCorrect ? selectedOption.takeaway : selectedOption.explanation}</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <button type="button" onClick={onBack} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '10px 16px', cursor: 'pointer' }}>Back</button>
          {isSolved && (
            <button type="button" onClick={onContinue} style={{ background: '#34d399', color: '#102017', border: 0, borderRadius: 999, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Continue
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
