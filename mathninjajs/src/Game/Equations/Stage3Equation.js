const format = (value) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? Number(number.toFixed(2)).toString() : '0';
};

export function getStage3Equation(preset, inverse = false) {
  const coefficients = preset?.coefficients || {};
  const a = format(coefficients.a ?? 1);
  const b = format(coefficients.b ?? 0);

  switch (preset?.formulaKind) {
    case 'exp-shift':
      return inverse
        ? `y = ln((x - ${b}) / ${a})`
        : `y = ${a}·e^x + ${b}`;
    case 'exp-rate':
      return inverse
        ? `y = ln(x / ${a}) / ${b}`
        : `y = ${a}·e^(${b}x)`;
    case 'log-linear':
      return inverse
        ? `y = e^((x - ${b}) / ${a})`
        : `y = ${a}·ln(x) + ${b}`;
    case 'log-shift':
      return inverse
        ? `y = (e^x - ${b}) / ${a}`
        : `y = ln(${a}x + ${b})`;
    default:
      return preset?.equation || 'y = 0';
  }
}