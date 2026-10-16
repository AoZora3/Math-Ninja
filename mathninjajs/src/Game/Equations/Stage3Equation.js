const format = (value) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? Number(number.toFixed(2)).toString() : '0';
};

export function getStage3Equation(preset, inverse = false) {
  const coefficients = preset?.coefficients || {};
  const a = format(coefficients.a ?? 1);
  const b = format(coefficients.b ?? 0);

  switch (preset?.formulaKind) {
    case 'exp-x-stretch':
      return inverse
        ? `y = ln((x - ${b}) / ${a})`
        : `y = ${a}e^x + ${b}`;
    case 'exp-rate-a':
      return inverse
        ? `y = ln(x - ${b}) / ${a}`
        : `y = e^(${a}x) + ${b}`;
    case 'exp-amplitude-rate':
      return inverse
        ? `y = ln(x / ${a}) / ${b}`
        : `y = ${a}e^(${b}x)`;
    case 'exp-output-scale':
      return inverse
        ? `y = ln(${a}x + ${b})`
        : `y = (e^x - ${b}) / ${a}`;
    default:
      return preset?.equation || 'y = 0';
  }
}