export const stage1Presets = [
  {
    id: 'linear1',
    type: 'linear',
    label: 'y = ax + b',
    equation: 'y = 2x + 1',
    title: 'LINEAR 1',
    description: 'A steady rising line.',
    coefficients: { a: 2, b: 1 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => c.a * x + c.b
  },
  {
    id: 'quad1',
    type: 'quadratic',
    label: 'y = ax² + b',
    equation: 'y = x²',
    title: 'QUADRATIC 1',
    description: 'A classic upward-opening parabola.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => c.a * x * x + c.b
  },
  {
    id: 'cubic1',
    type: 'cubic',
    label: 'y = ax³ + b',
    equation: 'y = x³',
    title: 'CUBIC EQUATION',
    description: 'An S-shaped graph with adjustable stretch and vertical shift.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => c.a * x * x * x + c.b
  },
];