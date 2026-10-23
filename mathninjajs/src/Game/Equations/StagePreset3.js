const invalidInverse = () => Number.NaN;

export const stage3Presets = [
  {
    id: 'exp-shift',
    type: 'exponential',
    formulaKind: 'exp-shift',
    label: 'y = a·e^x + b',
    equation: 'y = 2·e^x + 1',
    inverseEquation: 'y = ln((x - 1) / 2)',
    title: 'EXPONENTIAL SHIFT',
    description: 'Stretch the curve with a and move it up or down with b.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * Math.exp(x) + b : Number.NaN;
    },
    inverseFn: (x, c) => {
      const a = c?.a ?? 1;
      if (a === 0) return invalidInverse();
      return Math.log((x - (c?.b ?? 0)) / a);
    }
  },
  {
    id: 'exp-rate',
    type: 'exponential',
    formulaKind: 'exp-rate',
    label: 'y = a·e^(bx)',
    equation: 'y = 2·e^(1x)',
    inverseEquation: 'y = ln(x / 2) / 1',
    title: 'EXP RATE',
    description: 'The exponent coefficient changes how quickly the curve grows or decays.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-3, 3] },
    fn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 1;
      return Number.isFinite(x) ? a * Math.exp(b * x) : Number.NaN;
    },
    inverseFn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 1;
      if (a === 0 || b === 0) return invalidInverse();
      return Math.log(x / a) / b;
    }
  },
  {
    id: 'log-linear',
    type: 'logarithmic',
    formulaKind: 'log-linear',
    label: 'y = a·ln(x) + b',
    equation: 'y = 2·ln(x) + 1',
    inverseEquation: 'y = e^((x - 1) / 2)',
    title: 'LOG LINEAR',
    description: 'The coefficient stretches the log curve and b shifts it vertically.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 0;
      return Number.isFinite(x) && x > 0 ? a * Math.log(x) + b : Number.NaN;
    },
    inverseFn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 0;
      return Math.exp((x - b) / a);
    }
  },
  {
    id: 'log-shift',
    type: 'logarithmic',
    formulaKind: 'log-shift',
    label: 'y = ln(ax + b)',
    equation: 'y = ln(2x + 1)',
    inverseEquation: 'y = (e^x - 1) / 2',
    title: 'LOG SHIFT',
    description: 'The inside of the log compresses or shifts the curve horizontally.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 0;
      const inner = a * x + b;
      return Number.isFinite(x) && inner > 0 ? Math.log(inner) : Number.NaN;
    },
    inverseFn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 0;
      return x === null || x === undefined ? invalidInverse() : (Math.exp(x) - b) / a;
    }
  }
];
