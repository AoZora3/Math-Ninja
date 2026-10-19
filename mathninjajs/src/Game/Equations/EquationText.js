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
  const b = formatValue(coefficients.b ?? 0);

  if (preset?.waveType === 'sin-phase') {
    return `y = sin(${a}x ${b >= 0 ? '+' : '-'} ${formatValue(Math.abs(b))})`;
  }

  if (preset?.waveType === 'sin-cos-mix') {
    return `y = ${a}sin(x) ${b >= 0 ? '+' : '-'} ${formatValue(Math.abs(b))}cos(x)`;
  }

  if (preset?.waveType === 'cos-basic') {
    return `y = ${a}cos(x) ${b >= 0 ? '+' : '-'} ${formatValue(Math.abs(b))}`;
  }

  return `y = ${a}sin(x) ${b >= 0 ? '+' : '-'} ${formatValue(Math.abs(b))}`;
}