export const stage1Presets = [
  {
    id: 'linear1',
    type: 'linear',
    label: 'y = ax + b',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => c.a * x + c.b
  },
  {
    id: 'quad1',
    type: 'quadratic',
    label: 'y = ax² + b',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => c.a * x * x + c.b
  }
];