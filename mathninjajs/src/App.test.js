import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import PresetCard from './Components/PresetCards.jsx';
import Gameplay from './Screens/Gameplay/Gameplay.jsx';
import { GameContext } from './Context/GameContext.jsx';
import Timer from './Components/Timer.jsx';
import { stage2Presets } from './Game/Equations/StagePreset2.js';
import { getTrigonometricEquation } from './Game/Equations/EquationText.js';
import { stage3Presets } from './Game/Equations/StagePreset3.js';
import { getStage3Equation } from './Game/Equations/Stage3Equation.js';
import { calculateStars } from './Screens/StageResult/StageResult.jsx';

beforeEach(() => {
  window.localStorage.removeItem('mathNinjaUnlockedStep');
});

// Stage 3 tests simulate a save made after clearing Stages 1 and 2.
function unlockStage3ForTest() {
  window.localStorage.setItem('mathNinjaUnlockedStep', '3');
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

// Reset only changes the progression key; current audio settings remain intact.
test('reset progress relocks stages but leaves other settings alone', () => {
  window.localStorage.setItem('mathNinjaUnlockedStep', '4');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(screen.getByRole('button', { name: /endless mode/i })).toBeEnabled();

  fireEvent.click(screen.getByRole('button', { name: '←' }));
  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  fireEvent.change(screen.getByRole('slider', { name: /background music/i }), { target: { value: '35' } });
  fireEvent.click(screen.getByRole('button', { name: /reset progress/i }));
  expect(screen.getByText('35%')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /back/i }));
  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  expect(window.localStorage.getItem('mathNinjaUnlockedStep')).toBe('1');
  expect(screen.getByRole('button', { name: /trig waves/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /endless mode/i })).toBeDisabled();
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

test('Stage 2 multi-frequency coefficients match the displayed equation', () => {
  const preset = stage2Presets.find((item) => item.waveType === 'multi');
  const coefficients = { a: 2, b: 1, c: 3, d: 2 };
  const x = 0.5;

  expect(getTrigonometricEquation({ ...preset, coefficients })).toBe('y = 2sin(1x) + 3sin(2x)');
  expect(preset.fn(x, coefficients)).toBeCloseTo(2 * Math.sin(x) + 3 * Math.sin(2 * x), 5);
});

test('Stage 2 offsets and damping values appear in their matching formulas', () => {
  const classic = { ...stage2Presets[0], coefficients: { a: 1, b: 2, c: 3 } };
  const damped = { ...stage2Presets[2], coefficients: { a: 1, b: 2, c: 0.4, d: 3 } };
  const tangent = { ...stage2Presets[3], coefficients: { a: 1, b: 2, c: 3 } };

  expect(getTrigonometricEquation(classic)).toBe('y = 1sin(2x) + 3');
  expect(classic.fn(0, classic.coefficients)).toBeCloseTo(3);
  expect(getTrigonometricEquation(damped)).toBe('y = 1sin(2x)exp(-0.4x) + 3');
  expect(damped.fn(0, damped.coefficients)).toBeCloseTo(3);
  expect(getTrigonometricEquation(tangent)).toBe('y = 1tan(2x) + 3');
  expect(tangent.fn(0, tangent.coefficients)).toBeCloseTo(3);
});

// Each exponential must round-trip through the inverse logarithm with its sliders.
test('Stage 3 exponential presets match and invert the four suggested formulas', () => {
  const samples = [0.4, 0.5, 0.3, 0.2];
  const expected = [
    ['y = 2e^x + 1', 'y = ln((x - 1) / 2)'],
    ['y = e^(2x) + 1', 'y = ln(x - 1) / 2'],
    ['y = 2e^(0.5x)', 'y = ln(x / 2) / 0.5'],
    ['y = (e^x - 1) / 2', 'y = ln(2x + 1)']
  ];

  stage3Presets.forEach((preset, index) => {
    const x = samples[index];
    const y = preset.fn(x, preset.coefficients);

    expect(getStage3Equation(preset)).toBe(expected[index][0]);
    expect(getStage3Equation(preset, true)).toBe(expected[index][1]);
    expect(preset.inverseFn(y, preset.coefficients)).toBeCloseTo(x, 5);
  });
});

// Stage 1 should offer one built-in preset for each requested polynomial form.
test('stage 1 shows linear, quadratic, and cubic formulas and can add a cubic', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));

  expect(screen.getByText('y = 2x + 1')).toBeInTheDocument();
  expect(screen.getByText('y = 1x² + 0')).toBeInTheDocument();
  expect(screen.getByText('y = 1x³ + 0')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /add equation/i }));
  expect(screen.getByRole('button', { name: /^cubic$/i })).toBeInTheDocument();
});

// The gameplay switch follows the requested polynomial order and wraps around.
test('gameplay switches linear to quadratic to cubic and back to linear', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /graph basics/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByRole('button', { name: /switch to quadratic/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /switch to quadratic/i }));

  expect(screen.getByRole('button', { name: /switch to cubic/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /switch to cubic/i }));

  expect(screen.getByRole('button', { name: /switch to linear/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /switch to linear/i }));

  expect(screen.getByRole('button', { name: /switch to quadratic/i })).toBeInTheDocument();
});

test('stage 3 shows all four exponential/inverse-log presets and starts gameplay', () => {
  unlockStage3ForTest();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponentials \+ inverse logs/i }));
  expect(screen.getByRole('heading', { name: /exponentials \+ inverse logs/i })).toBeInTheDocument();
  expect(screen.getByText(/stretch \+ vertical shift/i)).toBeInTheDocument();
  expect(screen.getByText(/growth rate \+ shift/i)).toBeInTheDocument();
  expect(screen.getByText(/start value \+ rate/i)).toBeInTheDocument();
  expect(screen.getByText(/output scale \+ shift/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByLabelText('Time remaining 03:00')).toBeInTheDocument();
  expect(screen.getByLabelText('Time elapsed 00:00')).toBeInTheDocument();
  expect(screen.getByText('1x')).toBeInTheDocument();
});

// Pausing freezes the current countdown; Continue resumes it and Leave exits to the stage.
test('gameplay pause freezes and resumes the run, with a leave action', () => {
  jest.useFakeTimers();
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

  expect(screen.getAllByText('y = 2e^x + 1').length).toBeGreaterThan(1);
  fireEvent.click(screen.getByRole('button', { name: /show inverse log/i }));
  expect(screen.getAllByText('y = ln((x - 1) / 2)').length).toBeGreaterThan(1);
  expect(screen.getByText('logarithmic equation')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /show exponential/i }));
  expect(screen.getAllByText('y = 2e^x + 1').length).toBeGreaterThan(1);
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

test('backing out of gameplay resumes title music', () => {
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
  expect(screen.getByRole('heading', { name: /exponentials \+ inverse logs/i })).toBeInTheDocument();

  unmount();
  playSound.mockRestore();
});