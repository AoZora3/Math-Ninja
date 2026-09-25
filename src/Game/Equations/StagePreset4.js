export const stage4Presets = [
  {
    id: 'exp-hook',
    type: 'exponential',
    formulaKind: 'hook',
    label: 'y = A * exp(-B * (x - H)) + K',
    equation: 'y = 2 * exp(-1.5 * (x - 1)) + 0',
    title: 'HOOK SHOT',
    description: 'A steep hook that glides flat before snapping upward.',
    coefficients: { a: 2, b: 1.5, h: 1, k: 0 },
    minMax: { a: [0, 5], b: [0.2, 4], h: [-5, 5], k: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * Math.exp(-(c.b ?? 1) * (x - (c.h ?? 0))) + (c.k ?? 0)
  },
  {
    id: 'exp-logistic',
    type: 'exponential',
    formulaKind: 'logistic',
    label: 'y = L / (1 + exp(-B * (x - H)))',
    equation: 'y = 3 / (1 + exp(-1.5 * (x - 0)))',
    title: 'LANE SWITCHER',
    description: 'A sharp but smooth step-up curve between two height lanes.',
    coefficients: { l: 3, b: 1.5, h: 0 },
    minMax: { l: [0, 5], b: [0.2, 4], h: [-5, 5] },
    fn: (x, c) => (c.l ?? 1) / (1 + Math.exp(-(c.b ?? 1) * (x - (c.h ?? 0))))
  },
  {
    id: 'exp-arch',
    type: 'exponential',
    formulaKind: 'arch',
    label: 'y = A * (exp(B * (x - H)) + exp(-B * (x - H))) + K',
    equation: 'y = 1 * (exp(1 * (x - 0)) + exp(-1 * (x - 0))) + 0',
    title: 'DEEP DIVE',
    description: 'A U-shaped valley that dives down and curves back up.',
    coefficients: { a: 1, b: 1, h: 0, k: 0 },
    minMax: { a: [0, 5], b: [0.2, 4], h: [-5, 5], k: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * (Math.exp((c.b ?? 1) * (x - (c.h ?? 0))) + Math.exp(-(c.b ?? 1) * (x - (c.h ?? 0)))) + (c.k ?? 0)
  }
];
