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
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * x + b : Number.NaN;
    }
  },
  {
    id: 'quad-shift',
    type: 'quadratic',
    label: 'y = ax² + b',
    equation: 'y = x² + 0',
    title: 'QUADRATIC SHIFT',
    description: 'A classic upward-opening parabola with a vertical shift.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * x * x + b : Number.NaN;
    }
  },
  {
    id: 'quad-mix',
    type: 'quadratic',
    label: 'y = ax² + bx',
    equation: 'y = x² + x',
    title: 'QUADRATIC MIX',
    description: 'A parabola tilted by a linear term.',
    coefficients: { a: 1, b: 1 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * x * x + b * x : Number.NaN;
    }
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
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * x * x * x + b : Number.NaN;
    }
  },
];