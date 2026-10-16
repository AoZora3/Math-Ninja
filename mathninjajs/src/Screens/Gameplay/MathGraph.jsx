export default function MathGraph({
  activePreset,
  range = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
  width = 320,
  height = 260
}) {
  const graphWidth = 320;
  const graphHeight = 260;
  const xRange = range.xMax - range.xMin;
  const yRange = range.yMax - range.yMin;
  const points = [];

  if (activePreset && typeof activePreset.fn === 'function' && xRange > 0 && yRange > 0) {
    const step = xRange / 100;
    for (let x = range.xMin; x <= range.xMax; x += step) {
      const y = activePreset.fn(x, activePreset.coefficients || {});
      if (!Number.isFinite(y)) continue;

      const px = ((x - range.xMin) / xRange) * graphWidth;
      const py = graphHeight - ((y - range.yMin) / yRange) * graphHeight;
      points.push(`${px.toFixed(2)},${py.toFixed(2)}`);
    }
  }

  const originX = ((0 - range.xMin) / xRange) * graphWidth;
  const originY = graphHeight - ((0 - range.yMin) / yRange) * graphHeight;

  return (
    <svg
      className="graph-svg"
      viewBox={`0 0 ${graphWidth} ${graphHeight}`}
      preserveAspectRatio="none"
      width={width}
      height={height}
      role="img"
      aria-label="Equation graph preview"
    >
      {Array.from({ length: 11 }, (_, index) => {
        const x = (index / 10) * graphWidth;
        const y = (index / 10) * graphHeight;
        return (
          <g key={`grid-${index}`}>
            <line x1={x} y1={0} x2={x} y2={graphHeight} stroke="#2c3a4d" strokeWidth="1" />
            <line x1={0} y1={y} x2={graphWidth} y2={y} stroke="#2c3a4d" strokeWidth="1" />
          </g>
        );
      })}

      {originY >= 0 && originY <= graphHeight && (
        <line x1="0" y1={originY} x2={graphWidth} y2={originY} stroke="#dfe7f3" strokeWidth="2" />
      )}
      {originX >= 0 && originX <= graphWidth && (
        <line x1={originX} y1="0" x2={originX} y2={graphHeight} stroke="#dfe7f3" strokeWidth="2" />
      )}

      {points.length > 0 && (
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="#56e39f"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="live-curve"
        />
      )}
    </svg>
  );
}
