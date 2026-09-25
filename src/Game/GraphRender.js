// math coord -> pixel coord
export function toPixel(x, y, range, canvasWidth, canvasHeight) {
  const px = ((x - range.xMin) / (range.xMax - range.xMin)) * canvasWidth;
  const py = canvasHeight - ((y - range.yMin) / (range.yMax - range.yMin)) * canvasHeight;
  return { px, py };
}

// samples a preset's fn across the visible range, returns pixel points
export function sampleCurve(preset, range, canvasWidth, canvasHeight, step = 0.1) {
  const points = [];
  if (!preset || typeof preset.fn !== 'function') return points;

  for (let x = range.xMin; x <= range.xMax; x += step) {
    const y = preset.fn(x, preset.coefficients || {});
    if (y === null || !Number.isFinite(y)) continue;
    if (y < range.yMin || y > range.yMax) continue;
    points.push(toPixel(x, y, range, canvasWidth, canvasHeight));
  }
  return points;
}

// draws axes + curve onto a given canvas context
export function drawGraph(ctx, preset, range, width, height) {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = '#ccc';
  const origin = toPixel(0, 0, range, width, height);
  ctx.beginPath();
  ctx.moveTo(0, origin.py); ctx.lineTo(width, origin.py);
  ctx.moveTo(origin.px, 0); ctx.lineTo(origin.px, height);
  ctx.stroke();

  if (preset) {
    const points = sampleCurve(preset, range, width, height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.stroke();
  }
}
