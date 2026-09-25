export const stage3Presets = [
  {
    id: 'log-classic',
    type: 'logarithmic',
    formulaKind: 'classic',
    label: 'y = A * ln(x - H) + K',
    equation: 'y = 2 * ln(x - 1) + 0',
    title: 'LOGARITHMIC CURVE',
    description: 'A steep bend that flattens out as it moves along the path.',
    coefficients: { a: 2, b: 1, c: 0 },
    minMax: { a: [-5, 5], b: [-2, 4], c: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * Math.log(x - (c.b ?? 0)) + (c.c ?? 0)
  },
  {
    id: 'log-inverted',
    type: 'logarithmic',
    formulaKind: 'inverted',
    label: 'y = K - A * ln(x)',
    equation: 'y = 2 - 1.5 * ln(x)',
    title: 'INVERTED LOG',
    description: 'A sharp drop from the upper corner that settles flat.',
    coefficients: { a: 1.5, b: 0, c: 2 },
    minMax: { a: [-5, 5], b: [0, 2], c: [-5, 5] },
    fn: (x, c) => (c.c ?? 0) - (c.a ?? 1) * Math.log(x + (c.b ?? 0))
  },
  {
    id: 'log-steep',
    type: 'logarithmic',
    formulaKind: 'classic',
    label: 'y = A * ln(x - H) + K',
    equation: 'y = 3 * ln(x - 0.5) - 1',
    title: 'STEEP LOG',
    description: 'A dramatic curve that bends hard before leveling out.',
    coefficients: { a: 3, b: 0.5, c: -1 },
    minMax: { a: [-5, 5], b: [-2, 4], c: [-5, 5] },
    fn: (x, c) => (c.a ?? 1) * Math.log(x - (c.b ?? 0)) + (c.c ?? 0)
  }
];
