const formatValue = (value) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? Number(numericValue.toFixed(2)).toString() : '0';
};

const signedTerm = (value, term) => {
  const numericValue = Number(value ?? 0);
  const sign = numericValue < 0 ? '-' : '+';
  return ` ${sign} ${formatValue(Math.abs(numericValue))}${term}`;
};

export function getTrigonometricEquation(preset) {
  const coefficients = preset?.coefficients || {};
  const a = formatValue(coefficients.a ?? 1);
  const b = formatValue(coefficients.b ?? 1);
  const c = Number(coefficients.c ?? 0);
  const d = Number(coefficients.d ?? 0);

  if (preset?.waveType === 'multi') {
    return `y = ${a}sin(${b}x)${signedTerm(c, `sin(${formatValue(d)}x)`)}`;
  }

  if (preset?.waveType === 'damped') {
    return `y = ${a}sin(${b}x)exp(-${formatValue(c)}x)${signedTerm(d, '')}`;
  }

  if (preset?.waveType === 'tangent') {
    return `y = ${a}tan(${b}x)${signedTerm(c, '')}`;
  }

  return `y = ${a}sin(${b}x)${signedTerm(c, '')}`;
}