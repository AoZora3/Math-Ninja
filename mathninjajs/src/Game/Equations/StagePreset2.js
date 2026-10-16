export const stage2Presets = [
  {
    id: 'classic-wave',
    type: 'trigonometric',
    waveType: 'classic',
    label: 'y = A * sin(B * x) + C',
    equation: 'y = 1sin(1x) + 0',
    title: 'CLASSIC WAVE',
    description: 'Smooth repeating motion with a fixed ceiling and floor.',
    coefficients: { a: 1, b: 1, c: 0 },
    minMax: { a: [0, 3], b: [0.5, 3], c: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * Math.sin((c.b ?? 1) * x) + (c.c ?? 0)
  },
  {
    id: 'multi-frequency-wave',
    type: 'trigonometric',
    waveType: 'multi',
    label: 'y = A * sin(B * x) + C * sin(D * x)',
    equation: 'y = 1sin(1x) + 0sin(0x)',
    title: 'MULTI-FREQUENCY',
    description: 'A larger wave with smaller ripples mixed together.',
    coefficients: { a: 1, b: 1, c: 0, d: 0 },
    minMax: { a: [0, 3], b: [0.5, 3], c: [-5, 5], d: [-5, 5] },
    fn: (x, c) => {
      return (c.a ?? 1) * Math.sin((c.b ?? 1) * x) + (c.c ?? 0) * Math.sin((c.d ?? 1) * x);
    }
  },
  {
    id: 'damped-wave',
    type: 'trigonometric',
    waveType: 'damped',
    label: 'y = A * sin(B * x) * exp(-C * x) + D',
    equation: 'y = 1sin(1x)exp(-0.2x) + 0',
    title: 'DAMPED WAVE',
    description: 'A high-energy oscillation that fades back to rest.',
    coefficients: { a: 1, b: 1, c: 0.2, d: 0 },
    minMax: { a: [0, 3], b: [0.5, 3], c: [0, 1], d: [-5, 5] },
    fn: (x, c) => {
      return (c.a ?? 1) * Math.sin((c.b ?? 1) * x) * Math.exp(-(c.c ?? 0) * x) + (c.d ?? 0);
    }
  },
  {
    id: 'tangent-ramp',
    type: 'trigonometric',
    waveType: 'tangent',
    label: 'y = A * tan(B * x) + C',
    equation: 'y = 1tan(0.7x) + 0',
    title: 'TELEPORTING RAMP',
    description: 'A steep, asymptotic ramp that warps across the screen.',
    coefficients: { a: 1, b: 0.7, c: 0 },
    minMax: { a: [0, 3], b: [0.2, 2], c: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * Math.tan((c.b ?? 1) * x) + (c.c ?? 0)
  }
];