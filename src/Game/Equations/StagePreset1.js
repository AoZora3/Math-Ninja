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
    id: 'linear2',
    type: 'linear',
    label: 'y = ax + b',
    equation: 'y = -1.5x + 2',
    title: 'LINEAR 2',
    description: 'A descending line with a positive intercept.',
    coefficients: { a: -1.5, b: 2 },
    minMax: { a: [-5, 5], b: [-5, 5] },
    fn: (x, c) => c.a * x + c.b
  },
  {
    id: 'linear3',
    type: 'linear',
    label: 'y = ax + b',
    equation: 'y = 0.5x - 3',
    title: 'LINEAR 3',
    description: 'A gentle slope crossing below the origin.',
    coefficients: { a: 0.5, b: -3 },
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
    id: 'quad2',
    type: 'quadratic',
    label: 'y = ax² + b',
    equation: 'y = 1.5x² - 2',
    title: 'QUADRATIC 2',
    description: 'A steeper curve with a downward shift.',
    coefficients: { a: 1.5, b: -2 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => c.a * x * x + c.b
  },
  {
    id: 'quad3',
    type: 'quadratic',
    label: 'y = ax² + b',
    equation: 'y = -x² + 3',
    title: 'QUADRATIC 3',
    description: 'An inverted parabola that opens downward.',
    coefficients: { a: -1, b: 3 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => c.a * x * x + c.b
  }
];