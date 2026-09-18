export function checkEquationSlice(object, preset) {
  if (!object || !preset || typeof preset.fn !== 'function') {
    return false;
  }

  const x = Number(object.x);
  const y = Number(object.y);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return false;
  }

  const evaluatedY = preset.fn(x, preset.coefficients || {});
  if (!Number.isFinite(evaluatedY)) {
    return false;
  }

  const distance = Math.abs(evaluatedY - y);
  const xDistance = Math.abs(x);

  return distance <= 2.3 && xDistance <= 10;
}
