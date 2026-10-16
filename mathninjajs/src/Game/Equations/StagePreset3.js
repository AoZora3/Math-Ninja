const invalidInverse = () => Number.NaN;

export const stage3Presets = [
  {
    id: 'exp-a-stretch',
    type: 'exponential',
    formulaKind: 'exp-x-stretch',
    label: 'y = a * e^x + b',
    equation: 'y = 2e^x + 1',
    inverseEquation: 'y = ln((x - 1) / 2)',
    title: 'STRETCH + VERTICAL SHIFT',
    description: 'a stretches or flips the curve; b shifts it vertically.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * Math.exp(x) + (c.b ?? 0),
    inverseFn: (x, c) => {
      const a = c.a ?? 1;
      if (a === 0) return invalidInverse();
      return Math.log((x - (c.b ?? 0)) / a);
    }
  },
  {
    id: 'exp-rate-a',
    type: 'exponential',
    formulaKind: 'exp-rate-a',
    label: 'y = e^(a * x) + b',
    equation: 'y = e^(2x) + 1',
    inverseEquation: 'y = ln(x - 1) / 2',
    title: 'GROWTH RATE + SHIFT',
    description: 'a controls growth or decay rate; b shifts the curve vertically.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-3, 3], b: [-5, 5] },
    fn: (x, c) => Math.exp((c.a ?? 1) * x) + (c.b ?? 0),
    inverseFn: (x, c) => {
      const a = c.a ?? 1;
      if (a === 0) return invalidInverse();
      return Math.log(x - (c.b ?? 0)) / a;
    }
  },
  {
    id: 'exp-amplitude-rate',
    type: 'exponential',
    formulaKind: 'exp-amplitude-rate',
    label: 'y = a * e^(b * x)',
    equation: 'y = 2e^(0.5x)',
    inverseEquation: 'y = ln(x / 2) / 0.5',
    title: 'START VALUE + RATE',
    description: 'a is the start value; b controls growth or decay rate.',
    coefficients: { a: 2, b: 0.5 },
    minMax: { a: [-5, 5], b: [-3, 3] },
    fn: (x, c) => (c.a ?? 1) * Math.exp((c.b ?? 1) * x),
    inverseFn: (x, c) => {
      const a = c.a ?? 1;
      const b = c.b ?? 1;
      if (a === 0 || b === 0) return invalidInverse();
      return Math.log(x / a) / b;
    }
  },
  {
    id: 'exp-output-scale',
    type: 'exponential',
    formulaKind: 'exp-output-scale',
    label: 'y = (e^x - b) / a',
    equation: 'y = (e^x - 1) / 2',
    inverseEquation: 'y = ln(2x + 1)',
    title: 'OUTPUT SCALE + SHIFT',
    description: 'a scales the output; b shifts the inverse logarithm horizontally.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => {
      const a = c.a ?? 1;
      if (a === 0) return invalidInverse();
      return (Math.exp(x) - (c.b ?? 0)) / a;
    },
    inverseFn: (x, c) => Math.log((c.a ?? 1) * x + (c.b ?? 0))
  }
];
