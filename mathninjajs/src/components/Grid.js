import React, { useMemo } from 'react';
import { CartoonApple, CartoonBomb } from './Icons';


export function evaluateEquation(formulaStr, x) {
  try {
    if (!formulaStr) return NaN;
    let expr = formulaStr.replace(/^y\s*=\s*/i, '').trim();
    if (!expr) return 0;

    expr = expr.replace(/²/g, '^2');
    expr = expr.replace(/×/g, '*');
    expr = expr.replace(/÷/g, '/');

    expr = expr.replace(/(\d)\s*x/g, '$1 * x');
    expr = expr.replace(/(\d)\s*sin/g, '$1 * sin');
    expr = expr.replace(/(^|[^a-zA-Z0-9_])-x/g, '$1-1 * x');

    expr = expr.replace(/sin\(/g, 'Math.sin(');
    expr = expr.replace(/sqrt\(|√\(/g, 'Math.sqrt(');
    expr = expr.replace(/√x/g, 'Math.sqrt(x)');
    expr = expr.replace(/([a-zA-Z0-9_\(\)\.]+)\^2/g, 'Math.pow($1, 2)');

    expr = expr.replace(/\bx\b/g, `(${x})`);

    const fn = new Function(`return (${expr});`);
    const val = fn();
    return typeof val === 'number' && !isNaN(val) ? val : NaN;
  } catch {
    return NaN;
  }
}

export const Grid = ({
  range = 8,
  width = 345,
  height = 285,
  equation = 'y = 2x - 4',
  targets = [],
  onTargetClick = null,
  fullBleed = false,
}) => {
  const paddingX = fullBleed ? 0 : 16;
  const paddingY = fullBleed ? 0 : 16;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const toSvgX = (x) => paddingX + ((x + range) / (2 * range)) * plotWidth;
  const toSvgY = (y) => paddingY + ((range - y) / (2 * range)) * plotHeight;

  const ticks = useMemo(() => {
    const list = [];
    for (let i = -range; i <= range; i += 2) {
      list.push(i);
    }
    return list;
  }, [range]);

  const curvePath = useMemo(() => {
    if (!equation) return null;
    const samples = 140;
    const points = [];
    const dx = (2 * range) / samples;

    for (let i = 0; i <= samples; i++) {
      const x = -range + i * dx;
      const y = evaluateEquation(equation, x);

      if (!isNaN(y) && isFinite(y)) {
        const px = toSvgX(x);
        const py = toSvgY(y);
        points.push({ x: px, y: py, valid: Math.abs(y) <= range * 1.5 });
      } else {
        points.push({ valid: false });
      }
    }

    let d = '';
    let isDrawing = false;
    for (let p of points) {
      if (p.valid) {
        if (!isDrawing) {
          d += `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
          isDrawing = true;
        } else {
          d += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
        }
      } else {
        isDrawing = false;
      }
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equation, range, plotWidth, plotHeight, paddingX, paddingY]);

  const centerX = toSvgX(0);
  const centerY = toSvgY(0);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        display: 'block',
        background: '#04060a',
        borderRadius: fullBleed ? 0 : 14,
        border: fullBleed ? 'none' : '1px solid #1a2233',
        boxShadow: fullBleed ? 'none' : 'inset 0 0 20px rgba(0,0,0,0.8)',
        userSelect: 'none',
      }}
    >
      <defs>
        <filter id="neonSlashGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid Lines */}
      <g stroke="#0e1f33" strokeWidth="1">
        {ticks.map((t) => (
          <React.Fragment key={`grid-${t}`}>
            <line x1={toSvgX(t)} y1={0} x2={toSvgX(t)} y2={height} />
            <line x1={0} y1={toSvgY(t)} x2={width} y2={toSvgY(t)} />
          </React.Fragment>
        ))}
      </g>

      {/* Axes */}
      <g stroke="#1c6bc4" strokeWidth="2">
        <line x1={0} y1={centerY} x2={width} y2={centerY} />
        <line x1={centerX} y1={0} x2={centerX} y2={height} />
      </g>

      {/* Ticks and Labels */}
      <g>
        {ticks.map((t) => {
          const px = toSvgX(t);
          const py = toSvgY(t);

          return (
            <React.Fragment key={`tick-${t}`}>
              <line
                x1={px}
                y1={centerY - 4}
                x2={px}
                y2={centerY + 4}
                stroke="#00e5ff"
                strokeWidth="1.8"
              />
              <text
                x={px}
                y={centerY + 16}
                fill="#00e5ff"
                fontSize="11"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="700"
                textAnchor="middle"
              >
                {t}
              </text>

              {t !== 0 && (
                <>
                  <line
                    x1={centerX - 4}
                    y1={py}
                    x2={centerX + 4}
                    y2={py}
                    stroke="#00e5ff"
                    strokeWidth="1.8"
                  />
                  <text
                    x={centerX + 12}
                    y={py + 4}
                    fill="#00e5ff"
                    fontSize="11"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    textAnchor="start"
                  >
                    {t}
                  </text>
                </>
              )}
            </React.Fragment>
          );
        })}
      </g>

      {/* Targets */}
      {targets.map((tgt) => {
        const px = toSvgX(tgt.x);
        const py = toSvgY(tgt.y);
        const size = tgt.size || 52;

        return (
          <g
            key={tgt.id || `${tgt.x}-${tgt.y}`}
            transform={`translate(${px - size / 2}, ${py - size / 2})`}
            style={{ cursor: 'pointer' }}
            onClick={() => onTargetClick && onTargetClick(tgt)}
          >
            {tgt.type === 'bomb' ? (
              <CartoonBomb size={size} exploded={tgt.sliced} />
            ) : (
              <CartoonApple size={size} sliced={tgt.sliced} />
            )}
          </g>
        );
      })}

      {/* Curve Layer */}
      {curvePath && (
        <g className="equation-laser-layer">
          <path
            d={curvePath}
            fill="none"
            stroke="#00e5ff"
            strokeWidth="5"
            strokeOpacity="0.4"
            filter="url(#neonSlashGlow)"
            strokeLinecap="round"
          />
          <path
            d={curvePath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
};
