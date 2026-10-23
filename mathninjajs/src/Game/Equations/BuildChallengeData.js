const createOption = (id, label, fn, isCorrect, text) => ({
  id,
  label,
  fn,
  isCorrect,
  ...(isCorrect ? { takeaway: text } : { explanation: text })
});

export const BUILD_CHALLENGE_STEPS = [
  {
    id: 's1-q1',
    stage: 1,
    unlockedPresetId: 'quad-shift',
    unlocks: 'y = a*x^2 + b',
    prompt: 'What if we square x?',
    template: 'y = a * [ ? ] + b',
    initialCoefficients: { a: 1, b: 0 },
    targetFn: (x, a = 1, b = 0) => a * x * x + b,
    options: [
      createOption('square-x', 'x^2', (x, a, b) => a * x * x + b, true, 'Squaring makes negative and positive x give the same result, so both sides rise together into a smooth U-shape (a parabola).'),
      createOption('abs-x', '|x|', (x, a, b) => a * Math.abs(x) + b, false, 'Absolute value also makes both sides rise, but it draws a V with a sharp point. A parabola is round at the bottom.'),
      createOption('cube-x', 'x^3', (x, a, b) => a * x * x * x + b, false, 'Cubing keeps the sign, so one side goes down and the other goes up, like an S, not a U.'),
      createOption('sin-x', 'sin(x)', (x, a, b) => a * Math.sin(x) + b, false, 'Sine repeats in waves forever. The target is a single U that keeps rising.')
    ],
    takeaway: 'Squaring makes negative and positive x give the same result, so both sides rise together into a smooth U-shape (a parabola).'
  },
  {
    id: 's1-q2',
    stage: 1,
    unlockedPresetId: 'quad-mix',
    unlocks: 'y = a*x^2 + b*x',
    prompt: 'What if we add a plain x term?',
    template: 'y = a*x^2 [ ? ]',
    initialCoefficients: { a: 1, b: 1 },
    targetFn: (x, a = 1, b = 1) => a * x * x + b * x,
    options: [
      createOption('linear-term', '+ b*x', (x, a, b) => a * x * x + b * x, true, "The x term lets b slide the parabola's tip sideways, so the vertex leaves the y-axis."),
      createOption('constant', '+ b', (x, a, b) => a * x * x + b, false, 'That only moves the parabola straight up or down. Its tip stays on the y-axis.'),
      createOption('quadratic-term', '+ b*x^2', (x, a, b) => (a + b) * x * x, false, 'That just combines with a*x^2 into one width value, so the tip stays at the origin.'),
      createOption('reciprocal-term', '+ b/x', (x, a, b) => x === 0 ? Number.NaN : a * x * x + b / x, false, 'Dividing by x breaks the graph at x = 0, so it splits into pieces instead of one smooth U.')
    ],
    takeaway: "The x term lets b slide the parabola's tip sideways, so the vertex leaves the y-axis."
  },
  {
    id: 's1-q3',
    stage: 1,
    unlockedPresetId: 'cubic1',
    unlocks: 'y = a*x^3 + b',
    prompt: 'What if the power is 3?',
    template: 'y = a * x[ ? ] + b',
    initialCoefficients: { a: 1, b: 0 },
    targetFn: (x, a = 1, b = 0) => a * x * x * x + b,
    options: [
      createOption('power-3', '3', (x, a, b) => a * x * x * x + b, true, 'An odd power keeps the sign, so the ends go opposite ways, making an S-shape that flattens near the middle.'),
      createOption('power-2', '2', (x, a, b) => a * x * x + b, false, 'Squaring makes a U that rises on both sides, not an S.'),
      createOption('power-4', '4', (x, a, b) => a * x * x * x * x + b, false, 'Even powers act like squaring. Both ends rise, just with a flatter bottom and steeper sides.'),
      createOption('power-1', '1', (x, a, b) => a * x + b, false, 'A power of 1 is just a straight line.')
    ],
    takeaway: 'An odd power keeps the sign, so the ends go opposite ways, making an S-shape that flattens near the middle.'
  },
  {
    id: 's2-q1',
    stage: 2,
    unlockedPresetId: 'sin-phase',
    unlocks: 'y = sin(a*x + b)',
    prompt: 'What if a moves inside the sine?',
    template: 'y = sin( [ ? ] )',
    initialCoefficients: { a: 1, b: 1 },
    targetFn: (x, a = 1, b = 0) => Math.sin(a * x + b),
    options: [
      createOption('phase', 'a*x + b', (x, a, b) => Math.sin(a * x + b), true, 'Inside the sine, a squeezes or stretches the wave (frequency) and b slides it left or right (phase shift).'),
      createOption('frequency-only', 'a*x', (x, a) => Math.sin(a * x), false, "This changes the frequency but can't slide the wave sideways, and the target also moves left and right."),
      createOption('reciprocal-input', 'a / x', (x, a) => x === 0 ? Number.NaN : Math.sin(a / x), false, 'With x underneath, the wave bunches up near x = 0 instead of repeating evenly.'),
      createOption('quadratic-input', 'a*x^2 + b', (x, a, b) => Math.sin(a * x * x + b), false, "Squaring x makes the wave speed up the further it goes from the center, so it doesn't repeat at a steady rhythm.")
    ],
    takeaway: 'Inside the sine, a squeezes or stretches the wave (frequency) and b slides it left or right (phase shift).'
  },
  {
    id: 's2-q2',
    stage: 2,
    unlockedPresetId: 'cos-basic',
    unlocks: 'y = a*cos(x) + b',
    prompt: 'What if we swap sine for cosine?',
    template: 'y = a * [ ? ] + b',
    initialCoefficients: { a: 1, b: 0 },
    targetFn: (x, a = 1, b = 0) => a * Math.cos(x) + b,
    options: [
      createOption('cosine', 'cos(x)', (x, a, b) => a * Math.cos(x) + b, true, 'Cosine is the same wave as sine, shifted a quarter cycle, so it starts at its peak instead of at zero.'),
      createOption('sine', 'sin(x)', (x, a, b) => a * Math.sin(x) + b, false, "That's the wave you already have. It starts at the middle, but the target starts at its peak."),
      createOption('tangent', 'tan(x)', (x, a, b) => a * Math.tan(x) + b, false, "Tangent isn't a smooth wave. It has breaks where it shoots off to infinity."),
      createOption('double-sine', 'sin(2x)', (x, a, b) => a * Math.sin(2 * x) + b, false, "That's a faster wave that still starts at zero. The target runs at the same speed as sine, just shifted.")
    ],
    takeaway: 'Cosine is the same wave as sine, shifted a quarter cycle, so it starts at its peak instead of at zero.'
  },
  {
    id: 's2-q3',
    stage: 2,
    unlockedPresetId: 'sin-cos-mix',
    unlocks: 'y = a*sin(x) + b*cos(x)',
    prompt: 'What if we blend sine and cosine?',
    template: 'y = a*sin(x) [ ? ]',
    initialCoefficients: { a: 1, b: 1 },
    targetFn: (x, a = 1, b = 0) => a * Math.sin(x) + b * Math.cos(x),
    options: [
      createOption('add-cosine', '+ b*cos(x)', (x, a, b) => a * Math.sin(x) + b * Math.cos(x), true, 'Adding two waves of the same speed makes one smooth wave of that speed, with a new height and shift set by a and b together.'),
      createOption('multiply-cosine', '* b*cos(x)', (x, a, b) => a * Math.sin(x) * b * Math.cos(x), false, 'Multiplying them makes a wave that repeats twice as fast and shrinks, instead of blending.'),
      createOption('add-constant', '+ b', (x, a, b) => a * Math.sin(x) + b, false, 'That only lifts the sine wave up or down, which you already built.'),
      createOption('add-double-sine', '+ b*sin(2x)', (x, a, b) => a * Math.sin(x) + b * Math.sin(2 * x), false, 'A double-speed wave added on top makes a lumpy pattern, not one smooth wave.')
    ],
    takeaway: 'Adding two waves of the same speed makes one smooth wave of that speed, with a new height and shift set by a and b together.'
  },
  {
    id: 's3-q1',
    stage: 3,
    unlockedPresetId: 'exp-rate',
    unlocks: 'y = a*e^(b*x)',
    prompt: 'What if b goes in the power?',
    template: 'y = a * e^[ ? ]',
    initialCoefficients: { a: 1, b: 1 },
    targetFn: (x, a = 1, b = 1) => a * Math.exp(b * x),
    options: [
      createOption('rate-in-power', 'b*x', (x, a, b) => a * Math.exp(b * x), true, 'With b in the power, it controls the rate. Positive b grows, negative b decays, and b = 0 gives a flat line.'),
      createOption('shift-in-power', 'x + b', (x, a, b) => a * Math.exp(x + b), false, 'This only changes the starting height. It can never switch between growth and decay.'),
      createOption('square-in-power', 'x^2', (x, a) => a * Math.exp(x * x), false, 'Squaring makes both sides shoot upward into a bowl, not a steady growth or decay.'),
      createOption('divide-by-rate', 'x / b', (x, a, b) => b === 0 ? Number.NaN : a * Math.exp(x / b), false, 'Dividing by b breaks when b = 0, but the target must work for every value of b.')
    ],
    takeaway: 'With b in the power, it controls the rate. Positive b grows, negative b decays, and b = 0 gives a flat line.'
  },
  {
    id: 's3-q2',
    stage: 3,
    unlockedPresetId: 'log-linear',
    unlocks: 'y = a*ln(x) + b',
    prompt: 'What undoes an exponential?',
    template: 'y = a * [ ? ] + b',
    initialCoefficients: { a: 1, b: 0 },
    targetFn: (x, a = 1, b = 0) => (x > 0 ? a * Math.log(x) + b : Number.NaN),
    options: [
      createOption('natural-log', 'ln(x)', (x, a, b) => x > 0 ? a * Math.log(x) + b : Number.NaN, true, 'The natural log is the inverse of e^x, so it mirrors the curve across y = x. It rises fast, then slows, and exists only for x > 0.'),
      createOption('decay-exponential', 'e^(-x)', (x, a, b) => a * Math.exp(-x) + b, false, "This is still an exponential, just decaying. It reverses direction but doesn't undo e^x."),
      createOption('reciprocal', '1 / x', (x, a, b) => x === 0 ? Number.NaN : a / x + b, false, 'This splits into two pieces and never rises like the target.'),
      createOption('square-root', 'sqrt(x)', (x, a, b) => x >= 0 ? a * Math.sqrt(x) + b : Number.NaN, false, 'Square root also rises slowly from zero, but it undoes x^2, not e^x.')
    ],
    takeaway: 'The natural log is the inverse of e^x, so it mirrors the curve across y = x. It rises fast, then slows, and exists only for x > 0.'
  },
  {
    id: 's3-q3',
    stage: 3,
    unlockedPresetId: 'log-shift',
    unlocks: 'y = ln(a*x + b)',
    prompt: 'What if the sliders go inside the log?',
    template: 'y = ln( [ ? ] )',
    initialCoefficients: { a: 2, b: 1 },
    targetFn: (x, a = 2, b = 1) => {
      const inner = a * x + b;
      return inner > 0 ? Math.log(inner) : Number.NaN;
    },
    options: [
      createOption('linear-inside-log', 'a*x + b', (x, a, b) => {
        const inner = a * x + b;
        return inner > 0 ? Math.log(inner) : Number.NaN;
      }, true, 'Inside the log, a squeezes or stretches the curve sideways and b slides it left or right. It only exists where a*x + b is positive.'),
      createOption('scaled-input', 'a*x', (x, a) => a * x > 0 ? Math.log(a * x) : Number.NaN, false, "This squeezes the curve but can't slide it sideways, and the target slides."),
      createOption('combined-linear-input', 'a*x + b*x', (x, a, b) => (a + b) * x > 0 ? Math.log((a + b) * x) : Number.NaN, false, "That equals (a + b) times x, a single number times x, so b adds nothing new and can't slide the curve."),
      createOption('reciprocal-input-log', '1 / (a*x + b)', (x, a, b) => a * x + b > 0 ? Math.log(1 / (a * x + b)) : Number.NaN, false, 'A reciprocal breaks into pieces and shoots off to infinity, instead of a smooth log curve.')
    ],
    takeaway: 'Inside the log, a squeezes or stretches the curve sideways and b slides it left or right. It only exists where a*x + b is positive.'
  }
];

export const BUILD_CHALLENGE_BY_STAGE = {
  1: BUILD_CHALLENGE_STEPS.filter((step) => step.stage === 1),
  2: BUILD_CHALLENGE_STEPS.filter((step) => step.stage === 2),
  3: BUILD_CHALLENGE_STEPS.filter((step) => step.stage === 3)
};
