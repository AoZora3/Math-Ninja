export const stage2Presets = [
  {
    id: 'sin-basic',
    type: 'trigonometric',
    trigFunction: 'sin',
    waveType: 'sin-basic',
    label: 'y = a·sin(x) + b',
    equation: 'y = 1·sin(x) + 0',
    title: 'SINE SHIFT',
    description: 'A smooth wave that adjusts in height and offset.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-3, 3], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * Math.sin(x) + b : Number.NaN;
    }
  },
  {
    id: 'sin-phase',
    type: 'trigonometric',
    trigFunction: 'sin',
    waveType: 'sin-phase',
    label: 'y = sin(ax + b)',
    equation: 'y = sin(1x + 0)',
    title: 'SINE PHASE',
    description: 'The wave stretches and shifts in phase with a and b.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-3, 3], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 1;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? Math.sin(a * x + b) : Number.NaN;
    }
  },
  {
    id: 'cos-basic',
    type: 'trigonometric',
    trigFunction: 'cos',
    waveType: 'cos-basic',
    label: 'y = a·cos(x) + b',
    equation: 'y = 1·cos(x) + 0',
    title: 'COSINE SHIFT',
    description: 'A cosine wave with adjustable amplitude and lift.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-3, 3], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * Math.cos(x) + b : Number.NaN;
    }
  },
  {
    id: 'sin-cos-mix',
    type: 'trigonometric',
    trigFunction: 'sin',
    waveType: 'sin-cos-mix',
    label: 'y = a·sin(x) + b·cos(x)',
    equation: 'y = 1·sin(x) + 0·cos(x)',
    title: 'SIN + COS MIX',
    description: 'A combined wave with separate sine and cosine weights.',
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-3, 3], b: [-5, 5] },
    fn: (x, c) => {
      const a = c?.a ?? 0;
      const b = c?.b ?? 0;
      return Number.isFinite(x) ? a * Math.sin(x) + b * Math.cos(x) : Number.NaN;
    }
  }
];