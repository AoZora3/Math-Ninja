const formatValue = (value) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? Number(numericValue.toFixed(2)).toString() : '0';
};

const signedTerm = (value, term) => {
  const numericValue = Number(value ?? 0);
  const sign = numericValue < 0 ? '-' : '+';
  return ` ${sign} ${formatValue(Math.abs(numericValue))}${term}`;
};

export function getPolynomialEquation(preset) {
  const coefficients = preset?.coefficients || {};
  const a = formatValue(coefficients.a ?? 0);
  const b = Number(coefficients.b ?? 0);
  const power = preset?.type === 'quadratic' ? '²' : preset?.type === 'cubic' ? '³' : '';
  const term = preset?.formulaKind === 'quadratic-mix' ? 'x' : '';

  if (preset?.formulaKind === 'quadratic-mix' && Number(coefficients.a ?? 0) === 0) {
    return `y = ${formatValue(b)}x`;
  }

  return `y = ${a}x${power}${signedTerm(b, term)}`;
}

export function getEquationType(preset) {
  if (
    preset?.type === 'quadratic' &&
    preset.formulaKind === 'quadratic-mix' &&
    Number(preset.coefficients?.a ?? 0) === 0 &&
    Number(preset.coefficients?.b ?? 0) !== 0
  ) {
    return 'linear';
  }

  return preset?.type;
}

export function getTrigonometricFunction(preset) {
  if (preset?.trigFunction) return preset.trigFunction;

  switch (preset?.waveType) {
    case 'cos-basic':
      return 'cos';
    case 'sin-basic':
    case 'sin-phase':
    case 'sin-cos-mix':
    default:
      return 'sin';
  }
}

export function getTrigonometricFunctionName(functionName) {
  return ({
    sin: 'Sine',
    cos: 'Cosine',
    tan: 'Tangent',
    sec: 'Secant',
    cot: 'Cotangent',
    csc: 'Cosecant'
  })[functionName] || 'Sine';
}

export function getTrigonometricEquation(preset) {
  const coefficients = preset?.coefficients || {};
  const a = formatValue(coefficients.a ?? 1);
  const numericB = Number(coefficients.b ?? 0);
  const signedB = `${numericB < 0 ? '-' : '+'} ${formatValue(Math.abs(numericB))}`;

  if (preset?.trigFunction && preset.waveType?.startsWith('endless-')) {
    return `y = ${a} ${preset.trigFunction}(x) ${signedB}`;
  }

  if (preset?.waveType === 'sin-phase') {
    return `y = sin(${a}x ${signedB})`;
  }

  if (preset?.waveType === 'sin-cos-mix') {
    return `y = ${a} sin(x) ${signedB} cos(x)`;
  }

  if (preset?.waveType === 'cos-basic') {
    return `y = ${a} cos(x) ${signedB}`;
  }

  return `y = ${a} sin(x) ${signedB}`;
}