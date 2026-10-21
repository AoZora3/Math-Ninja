import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import PresetCard from './Components/PresetCards.jsx';
import Gameplay from './Screens/Gameplay/Gameplay.jsx';
import BuildChallenge from './Screens/BuildChallenge/BuildChallenge.jsx';
import { GameContext } from './Context/GameContext.jsx';
import Timer from './Components/Timer.jsx';
import * as Collision from './Game/Collision.js';
import { stage2Presets } from './Game/Equations/StagePreset2.js';
import { stage1Presets } from './Game/Equations/StagePreset1.js';
import { getTrigonometricEquation } from './Game/Equations/EquationText.js';
import { stage3Presets } from './Game/Equations/StagePreset3.js';
import { getStage3Equation } from './Game/Equations/Stage3Equation.js';
import { BUILD_CHALLENGE_STEPS, BUILD_CHALLENGE_BY_STAGE } from './Game/Equations/BuildChallengeData.js';
import { calculateStars } from './Screens/StageResult/StageResult.jsx';

beforeEach(() => {
  window.localStorage.removeItem('mathNinjaUnlockedStep');
  window.localStorage.removeItem('mathNinjaUnlockedFormulas');
  window.localStorage.removeItem('mathNinjaStageStars');
  window.localStorage.removeItem('mathNinjaEndlessHighScore');
});

test('all three stages expose the full 12-formula build chain with the first formula unlocked by default', () => {
  const expected = [
    'y = ax + b',
    'y = ax² + b',
    'y = ax² + bx',
    'y = ax³ + b',
    'y = a·sin(x) + b',
    'y = sin(ax + b)',
    'y = a·cos(x) + b',
    'y = a·sin(x) + b·cos(x)',
    'y = a·e^x + b',
    'y = a·e^(bx)',
    'y = a·ln(x) + b',
    'y = ln(ax + b)'
  ];

  const allPresets = [...stage1Presets, ...stage2Presets, ...stage3Presets];
  expect(allPresets).toHaveLength(12);
  expect(allPresets.map((preset) => preset.label)).toEqual(expected);
  expect(stage1Presets[0].id).toBe('linear1');
  expect(stage1Presets[0].coefficients).toEqual({ a: 2, b: 1 });
});

test('build challenge data contains nine locked steps with a correct tile and a one-line takeaway for each', () => {
  expect(BUILD_CHALLENGE_STEPS).toHaveLength(9);
  expect(BUILD_CHALLENGE_BY_STAGE[1]).toHaveLength(3);
  expect(BUILD_CHALLENGE_BY_STAGE[2]).toHaveLength(3);
  expect(BUILD_CHALLENGE_BY_STAGE[3]).toHaveLength(3);

  BUILD_CHALLENGE_STEPS.forEach((step) => {
    expect(step).toHaveProperty('prompt');
    expect(step).toHaveProperty('template');
    expect(step).toHaveProperty('takeaway');
    expect(step).toHaveProperty('unlockedPresetId');
    expect(step.options).toHaveLength(4);
    expect(step.options.filter((option) => option.isCorrect)).toHaveLength(1);
    expect(step.options.every((option) => typeof option.fn === 'function')).toBe(true);
    expect(step.options.filter((option) => option.isCorrect).every((option) => option.takeaway === step.takeaway)).toBe(true);
    expect(step.options.filter((option) => !option.isCorrect).every((option) => typeof option.explanation === 'string' && option.explanation.length > 0)).toBe(true);
  });
});

test('build challenge formula updates a and b, replaces the placeholder, and keeps its target fixed', () => {
  const step = BUILD_CHALLENGE_STEPS[1];
  const onComplete = jest.fn();
  const { container } = render(<BuildChallenge step={step} onComplete={onComplete} />);
  const targetCurveBefore = container.querySelector('svg path')?.getAttribute('d');
  expect(container.querySelectorAll('.challenge-grid line')).toHaveLength(22);
  expect(container.querySelectorAll('.challenge-axes line')).toHaveLength(2);

  fireEvent.click(screen.getByRole('button', { name: '+ b*x' }));
  expect(container.querySelectorAll('.challenge-graph')).toHaveLength(2);
  expect(container.querySelectorAll('.challenge-grid line')).toHaveLength(44);
  expect(container.querySelector('.challenge-choice-value')).toHaveTextContent('+ 0*x');
  expect(container.querySelector('.challenge-equation .challenge-coefficient-a')).toHaveTextContent('0');
  expect(container.querySelector('.challenge-equation .challenge-coefficient-b')).toHaveTextContent('0');

  fireEvent.change(screen.getByRole('slider', { name: 'a' }), { target: { value: '1' } });
  fireEvent.change(screen.getByRole('slider', { name: 'b' }), { target: { value: '1' } });

  expect(container.querySelector('.challenge-equation .challenge-coefficient-a')).toHaveTextContent('1');
  expect(container.querySelector('.challenge-equation .challenge-coefficient-b')).toHaveTextContent('1');
  expect(container.querySelector('.challenge-choice-value')).toHaveTextContent('+ 1*x');
  expect(container.querySelectorAll('.challenge-coefficient-a')).toHaveLength(2);
  expect(container.querySelectorAll('.challenge-coefficient-b')).toHaveLength(2);
  expect(container.querySelector('svg path')?.getAttribute('d')).toBe(targetCurveBefore);
  expect(onComplete).toHaveBeenCalledWith(step.unlockedPresetId);
});

// Stage 3 tests simulate a save made after clearing Stages 1 and 2.
function unlockStage3ForTest() {
  window.localStorage.setItem('mathNinjaUnlockedStep', '3');
  window.localStorage.setItem('mathNinjaUnlockedFormulas', JSON.stringify({
    'exp-shift': true,
    'exp-rate': true,
    'log-linear': true,
    'log-shift': true
  }));
}

function unlockStage1FormulasForTest() {
  window.localStorage.setItem('mathNinjaUnlockedFormulas', JSON.stringify({
    linear1: true,
    'quad-shift': true,
    'quad-mix': true,
    cubic1: true
  }));
}

function unlockEndlessForTest(unlockedFormulas) {
  window.localStorage.setItem('mathNinjaUnlockedStep', '4');
  window.localStorage.setItem('mathNinjaUnlockedFormulas', JSON.stringify(unlockedFormulas));
}

test('renders the title screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /^MATH$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
});

test('waits for the splash start button before playing title music', () => {
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { unmount } = render(<App />);

  expect(playSound).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(playSound).toHaveBeenCalled();

  unmount();
  playSound.mockRestore();
});

test('controlled countdown reflects a round restart from zero to full time', () => {
  const { rerender } = render(<Timer mode="countdown" seconds={0} />);

  expect(screen.getByLabelText('Time remaining 00:00')).toBeInTheDocument();

  rerender(<Timer mode="countdown" seconds={45} />);

  expect(screen.getByLabelText('Time remaining 00:45')).toBeInTheDocument();
});

test('menu buttons play a click sound', () => {
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));

  expect(playSound).toHaveBeenCalledTimes(1);

  unmount();
  playSound.mockRestore();
});


test('settings open as an overlay without replacing the title screen', () => {
  const pauseSound = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation();
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));

  expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^MATH$/i })).toBeInTheDocument();

  unmount();
  pauseSound.mockRestore();
});

test('settings slider changes the background music volume', () => {
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { container, unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));

  const volumeSlider = screen.getByRole('slider', { name: /background music/i });
  fireEvent.change(volumeSlider, { target: { value: '35' } });

  expect(screen.getByText('35%')).toBeInTheDocument();
  expect(container.querySelector('audio').volume).toBeCloseTo(0.35);

  fireEvent.click(screen.getByRole('button', { name: /back/i }));
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(playSound).toHaveBeenCalled();

  unmount();
  playSound.mockRestore();
});

test('sound-effects volume is independent from background music volume', () => {
  const playedPlayers = [];
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () {
    playedPlayers.push(this);
    return Promise.resolve();
  });
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  const musicSlider = screen.getByRole('slider', { name: /background music/i });
  const initialMusicVolume = musicSlider.value;
  fireEvent.change(screen.getByRole('slider', { name: /sound effects/i }), { target: { value: '25' } });
  expect(screen.getByText('25%')).toBeInTheDocument();
  expect(musicSlider).toHaveValue(initialMusicVolume);
  expect(screen.getByRole('button', { name: /reset progress/i })).toBeEnabled();

  fireEvent.click(screen.getByRole('button', { name: /back/i }));
  playSound.mockClear();
  playedPlayers.length = 0;
  fireEvent.click(screen.getByRole('button', { name: /settings/i }));

  expect(playedPlayers[0].volume).toBeCloseTo(0.25);

  unmount();
  playSound.mockRestore();
});

// A new local save starts with Stage 1 as the only available stage.
test('only Stage 1 is unlocked for a new local save', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  expect(screen.getByRole('button', { name: /graph basics/i })).toBeEnabled();
  expect(screen.getByRole('button', { name: /trig waves/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /exponentials \+ inverse logs/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /endless mode/i })).toBeDisabled();
});

test('Endless displays unlocked equation types, supports adding types, and starts with a shorter timer', () => {
  unlockEndlessForTest({
    'quad-shift': true,
    'sin-basic': true
  });
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /endless mode/i }));

  expect(screen.getByRole('heading', { name: /endless formulas/i })).toBeInTheDocument();
  expect(container.querySelectorAll('.endless-presets-block li')).toHaveLength(4);
  expect(screen.getByText('linear')).toBeInTheDocument();
  expect(screen.getByText('quadratic')).toBeInTheDocument();
  expect(screen.getByText('trigonometric')).toBeInTheDocument();
  expect(screen.getByText('exponential')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /edit preset/i })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /add equation/i }));
  ['Linear', 'Quadratic', 'Cubic', 'Trigonometric', 'Exponential', 'Logarithmic'].forEach((type) => {
    expect(screen.getByRole('button', { name: type })).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole('button', { name: '←' }));

  fireEvent.click(screen.getByRole('button', { name: /start endless/i }));
  expect(screen.getByText('ENDLESS SCORE')).toBeInTheDocument();
  expect(screen.getByLabelText('Time remaining 01:00')).toBeInTheDocument();
  expect(container.querySelectorAll('.hotbar-button')).toHaveLength(4);
  expect(screen.getByRole('button', { name: /linear y = 2x \+ 1/i })).toBeInTheDocument();
});

test('Endless fruit adds time and bombs remove time from the shorter timer', () => {
  jest.useFakeTimers();
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  unlockEndlessForTest({});
  const { container, unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /endless mode/i }));
  fireEvent.click(screen.getByRole('button', { name: /start endless/i }));

  const random = jest.spyOn(Math, 'random').mockReturnValue(0.9);
  const checkSlice = jest.spyOn(Collision, 'checkEquationSlice').mockReturnValue(true);
  act(() => jest.advanceTimersByTime(1500));
  expect(screen.getByLabelText('Time remaining 00:59')).toBeInTheDocument();
  expect(container.querySelector('.spawned-target')).toHaveAttribute('aria-label', 'Fruit');
  fireEvent.click(screen.getByRole('button', { name: /fire equation/i }));
  expect(screen.getByLabelText('Time remaining 01:04')).toBeInTheDocument();

  random.mockReturnValue(0.1);
  act(() => jest.advanceTimersByTime(1500));
  expect(container.querySelector('.spawned-target')).toHaveAttribute('aria-label', 'Bomb');
  fireEvent.click(screen.getByRole('button', { name: /fire equation/i }));
  expect(screen.getByLabelText('Time remaining 00:57')).toBeInTheDocument();

  unmount();
  random.mockRestore();
  checkSlice.mockRestore();
  playSound.mockRestore();
  jest.useRealTimers();
});

test('Endless records the best score and displays it on the stage selector', () => {
  jest.useFakeTimers();
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  unlockEndlessForTest({ 'linear1': true });
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /endless mode/i }));
  fireEvent.click(screen.getByRole('button', { name: /start endless/i }));

  const random = jest.spyOn(Math, 'random').mockReturnValue(0.9);
  const checkSlice = jest.spyOn(Collision, 'checkEquationSlice').mockReturnValue(true);
  act(() => jest.advanceTimersByTime(1500));
  fireEvent.click(screen.getByRole('button', { name: /fire equation/i }));

  const savedHighScore = Number(window.localStorage.getItem('mathNinjaEndlessHighScore'));
  expect(savedHighScore).toBeGreaterThan(0);
  expect(screen.getByText(`BEST ${savedHighScore}`)).toBeInTheDocument();

  unmount();
  random.mockRestore();
  checkSlice.mockRestore();
  playSound.mockRestore();
  jest.useRealTimers();

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(document.querySelector('.endless-best')).toHaveTextContent(`Highest score: ${savedHighScore}`);
});

test('stage stars persist and completion returns to stage select', () => {
  jest.useFakeTimers();
  unlockStage1FormulasForTest();
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  const random = jest.spyOn(Math, 'random').mockReturnValue(0.9);
  const checkSlice = jest.spyOn(Collision, 'checkEquationSlice').mockReturnValue(true);
  for (let hit = 0; hit < 12 && screen.queryByRole('button', { name: /fire equation/i }); hit += 1) {
    act(() => jest.advanceTimersByTime(1500));
    fireEvent.click(screen.getByRole('button', { name: /fire equation/i }));
  }

  expect(screen.getByRole('heading', { name: /stage cleared/i })).toBeInTheDocument();
  expect(window.localStorage.getItem('mathNinjaStageStars')).toContain('"stage1":3');
  fireEvent.click(screen.getByRole('button', { name: /select stages/i }));
  expect(screen.getByRole('heading', { name: /stage select/i })).toBeInTheDocument();
  expect(screen.getByLabelText('Stage 1: 3 of 3 stars')).toBeInTheDocument();

  unmount();
  random.mockRestore();
  checkSlice.mockRestore();
  playSound.mockRestore();
  jest.useRealTimers();
});

// Three deliberate Settings-title clicks persist the all-stages unlock.
test('three Settings title clicks unlock all stages and reset relocks them', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  const settingsTitleButton = within(screen.getByRole('dialog')).getByRole('button', { name: /^settings$/i });
  fireEvent.click(settingsTitleButton);
  fireEvent.click(settingsTitleButton);
  expect(window.localStorage.getItem('mathNinjaUnlockedStep')).toBe('1');

  fireEvent.click(settingsTitleButton);
  expect(window.localStorage.getItem('mathNinjaUnlockedStep')).toBe('4');

  fireEvent.click(screen.getByRole('button', { name: /reset progress/i }));
  expect(window.localStorage.getItem('mathNinjaUnlockedStep')).toBe('1');
});

// Reset removes stage/formula progress while preserving audio settings.
test('reset progress relocks stages and formulas but leaves other settings alone', () => {
  window.localStorage.setItem('mathNinjaUnlockedStep', '4');
  window.localStorage.setItem('mathNinjaUnlockedFormulas', JSON.stringify({
    linear1: true,
    'quad-shift': true,
    'quad-mix': true,
    cubic1: true,
    'sin-basic': true,
    'sin-phase': true,
    'cos-basic': true,
    'sin-cos-mix': true,
    'exp-shift': true,
    'exp-rate': true,
    'log-linear': true,
    'log-shift': true
  }));
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(screen.getByRole('button', { name: /endless mode/i })).toBeEnabled();

  fireEvent.click(screen.getByRole('button', { name: /back to title screen/i }));
  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  fireEvent.change(screen.getByRole('slider', { name: /background music/i }), { target: { value: '35' } });
  fireEvent.click(screen.getByRole('button', { name: /reset progress/i }));
  expect(screen.getByText('35%')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /back/i }));
  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  expect(window.localStorage.getItem('mathNinjaUnlockedStep')).toBe('1');
  expect(JSON.parse(window.localStorage.getItem('mathNinjaUnlockedFormulas'))).toEqual({
    linear1: true,
    'sin-basic': true,
    'exp-shift': true
  });
  expect(screen.getByRole('button', { name: /trig waves/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /endless mode/i })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));
  expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  expect(container.querySelectorAll('.hotbar-button')).toHaveLength(0);
  expect(screen.queryByRole('button', { name: /quadratic y = 1x² \+ 0/i })).not.toBeInTheDocument();
});

// A successful gameplay result is the event that advances stage progression.
test('a winning gameplay result invokes the progression callback', () => {
  const onWin = jest.fn();

  render(
    <GameContext.Provider value={{
      presets: [],
      activePreset: null,
      setActivePreset: jest.fn(),
      score: 100,
      lives: 3,
      timeLeft: 100,
      hitRate: 100
    }}>
      <Gameplay onWin={onWin} />
    </GameContext.Provider>
  );

  expect(onWin).toHaveBeenCalledTimes(1);
});

test('renders preset cards safely when coefficients are missing', () => {
  expect(() => {
    render(
      <PresetCard
        preset={{ id: 'temp', label: 'y = ax + b', type: 'linear' }}
        onChange={() => {}}
      />
    );
  }).not.toThrow();
});

test('Stage 2 sine-cosine coefficients match the displayed equation', () => {
  const preset = stage2Presets.find((item) => item.waveType === 'sin-cos-mix');
  const coefficients = { a: 2, b: 3 };
  const x = 0.5;

  expect(getTrigonometricEquation({ ...preset, coefficients })).toBe('y = 2sin(x) + 3cos(x)');
  expect(preset.fn(x, coefficients)).toBeCloseTo(2 * Math.sin(x) + 3 * Math.cos(x), 5);
});

test('Stage 2 phase, cosine, and mixed-wave equations show their coefficients', () => {
  const phase = { ...stage2Presets[1], coefficients: { a: 2, b: 1 } };
  const cosine = { ...stage2Presets[2], coefficients: { a: 1, b: 2 } };
  const mixed = { ...stage2Presets[3], coefficients: { a: 1, b: 2 } };

  expect(getTrigonometricEquation(phase)).toBe('y = sin(2x + 1)');
  expect(phase.fn(0, phase.coefficients)).toBeCloseTo(Math.sin(1));
  expect(getTrigonometricEquation(cosine)).toBe('y = 1cos(x) + 2');
  expect(cosine.fn(0, cosine.coefficients)).toBeCloseTo(3);
  expect(getTrigonometricEquation(mixed)).toBe('y = 1sin(x) + 2cos(x)');
  expect(mixed.fn(0, mixed.coefficients)).toBeCloseTo(2);
});

// Each exponential must round-trip through the inverse logarithm with its sliders.
test('Stage 3 exponential presets match and invert the four suggested formulas', () => {
  const samples = [0.4, 0.5, 0.3, 0.2];
  const expected = [
    ['y = 2·e^x + 1', 'y = ln((x - 1) / 2)'],
    ['y = 2·e^(1x)', 'y = ln(x / 2) / 1'],
    ['y = 2·ln(x) + 1', 'y = e^((x - 1) / 2)'],
    ['y = ln(2x + 1)', 'y = (e^x - 1) / 2']
  ];

  stage3Presets.forEach((preset, index) => {
    const x = samples[index];
    const y = preset.fn(x, preset.coefficients);

    expect(getStage3Equation(preset)).toBe(expected[index][0]);
    expect(getStage3Equation(preset, true)).toBe(expected[index][1]);
    expect(preset.inverseFn(y, preset.coefficients)).toBeCloseTo(x, 5);
  });
});

// Locked formulas stay hidden; each challenge requires a correct formula and matching sliders.
test('stage 1 reveals formulas one challenge at a time and requires a slider match', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));

  expect(screen.getByText('y = 2x + 1')).toBeInTheDocument();
  expect(screen.queryByText('y = 1x² + 0')).not.toBeInTheDocument();
  expect(screen.queryByText('y = 1x³ + 0')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /add equation/i })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /build formula/i }));
  expect(screen.getByText('What if we square x?')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '|x|' }));
  expect(screen.getByText('Absolute value also makes both sides rise, but it draws a V with a sharp point. A parabola is round at the bottom.')).toBeInTheDocument();
  expect(document.querySelectorAll('svg path').length).toBeGreaterThanOrEqual(2);

  fireEvent.click(screen.getByRole('button', { name: 'x^2' }));
  expect(screen.getByText('Adjust a to 1 and b to 0 to match the fixed target curve.')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('slider', { name: 'a' }), { target: { value: '1' } });
  expect(screen.getByText('Squaring makes negative and positive x give the same result, so both sides rise together into a smooth U-shape (a parabola).')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /build formula/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByRole('heading', { name: /graph basics/i })).toBeInTheDocument();
  expect(screen.getByText('y = 1x² + 0')).toBeInTheDocument();
  expect(screen.queryByText('y = 1x³ + 0')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /build formula/i }));
  expect(screen.getByText('What if we add a plain x term?')).toBeInTheDocument();
});

test('stage 1 allows adding equations after all built-in formulas are unlocked', () => {
  window.localStorage.setItem('mathNinjaUnlockedFormulas', JSON.stringify({
    linear1: true,
    'quad-shift': true,
    'quad-mix': true,
    cubic1: true
  }));
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));

  expect(screen.getByRole('button', { name: /add equation/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /add equation/i }));
  expect(screen.getByRole('button', { name: /^cubic$/i })).toBeInTheDocument();
});

// A stage requires four unlocked formulas before gameplay can start.
test('gameplay is blocked until four formula presets are unlocked', () => {
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));

  expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  expect(screen.getByText(/formula presets: 1\/4/i)).toBeInTheDocument();
  expect(container.querySelectorAll('.hotbar-button')).toHaveLength(0);
});

test('stage 3 requires four formulas and starts gameplay when they are unlocked', () => {
  unlockStage3ForTest();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponentials \+ inverse logs/i }));
  expect(screen.getByRole('heading', { name: /exponentials \+ inverse logs/i })).toBeInTheDocument();
  expect(screen.getByText(/formula presets: 4\/4/i)).toBeInTheDocument();
  expect(screen.getByText(/move it up or down with b/i)).toBeInTheDocument();
  expect(screen.queryByText(/growth rate \+ shift/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/start value \+ rate/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/output scale \+ shift/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByLabelText('Time remaining 03:00')).toBeInTheDocument();
  expect(screen.getByLabelText('Time elapsed 00:00')).toBeInTheDocument();
  expect(screen.getByText('1x')).toBeInTheDocument();
});

// Pausing freezes the current countdown; Continue resumes it and Leave exits to the stage.
test('gameplay pause freezes and resumes the run, with a leave action', () => {
  jest.useFakeTimers();
  unlockStage1FormulasForTest();
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  fireEvent.click(screen.getByRole('button', { name: /pause/i }));

  expect(screen.getByRole('dialog', { name: /paused/i })).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(5000));
  expect(screen.getByLabelText('Time remaining 03:00')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  expect(screen.queryByRole('dialog', { name: /paused/i })).not.toBeInTheDocument();
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByLabelText('Time remaining 02:59')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /pause/i }));
  fireEvent.click(screen.getByRole('button', { name: /leave/i }));
  expect(screen.getByRole('heading', { name: /graph basics/i })).toBeInTheDocument();

  unmount();
  playSound.mockRestore();
  jest.useRealTimers();
});

// The gameplay inverse control swaps both the displayed formula and active function.
test('Stage 3 gameplay toggles between an exponential and its inverse logarithm', () => {
  unlockStage3ForTest();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponentials \+ inverse logs/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getAllByText(getStage3Equation(stage3Presets[0])).length).toBeGreaterThanOrEqual(1);
  fireEvent.click(screen.getByRole('button', { name: /show inverse log/i }));
  expect(screen.getAllByText(getStage3Equation(stage3Presets[0], true)).length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(/logarithmic equation:/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /show exponential/i }));
  expect(screen.getAllByText(getStage3Equation(stage3Presets[0])).length).toBeGreaterThanOrEqual(1);
});

test('stars reflect health, hit rate, and the two-minute goal threshold', () => {
  expect(calculateStars({ won: true, lives: 2, hitRate: 80, elapsedSeconds: 120 })).toBe(3);
  expect(calculateStars({ won: true, lives: 1, hitRate: 79.9, elapsedSeconds: 121 })).toBe(0);
  expect(calculateStars({ won: false, lives: 3, hitRate: 100, elapsedSeconds: 60 })).toBe(0);
});

test('firing an equation animates a slash and restores the live preview', () => {
  unlockStage3ForTest();
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const pauseSound = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation();
  const { container, unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponentials \+ inverse logs/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  fireEvent.click(screen.getByRole('button', { name: /fire equation/i }));

  // Stage 3 begins with its first exponential/inverse-log preset.
  const firedCurve = container.querySelector('.fired-curve');
  expect(firedCurve).toBeInTheDocument();
  expect(container.querySelector('.live-curve')).not.toBeInTheDocument();

  fireEvent.animationEnd(firedCurve);
  expect(container.querySelector('.live-curve')).toBeInTheDocument();

  unmount();
  playSound.mockRestore();
  pauseSound.mockRestore();
});


test('repeated miss effects use separate audio players so they can overlap', () => {
  unlockStage3ForTest();
  const playedPlayers = [];
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () {
    playedPlayers.push(this);
    return Promise.resolve();
  });
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponentials \+ inverse logs/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  playSound.mockClear();
  playedPlayers.length = 0;

  const fireButton = screen.getByRole('button', { name: /fire equation/i });
  fireEvent.click(fireButton);
  fireEvent.click(fireButton);

  expect(playSound).toHaveBeenCalledTimes(2);
  expect(playedPlayers[0]).not.toBe(playedPlayers[1]);

  unmount();
  playSound.mockRestore();
});

test('leaving gameplay returns to stage select and resumes menu music', () => {
  unlockStage3ForTest();
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponentials \+ inverse logs/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  playSound.mockClear();

  fireEvent.click(screen.getByRole('button', { name: /pause/i }));
  fireEvent.click(screen.getByRole('button', { name: /leave/i }));

  expect(playSound).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('heading', { name: /stage select/i })).toBeInTheDocument();

  unmount();
  playSound.mockRestore();
});