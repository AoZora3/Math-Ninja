import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import PresetCard from './Components/PresetCards.jsx';
import { stage2Presets } from './Game/Equations/StagePreset2.js';
import { calculateStars } from './Screens/StageResult/StageResult.jsx';

test('renders the title screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /^MATH$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
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

test('stage 2 c and d sliders move the wave vertically across trig presets', () => {
  const preset = stage2Presets[0];
  const amplitude = 2;
  const frequency = 2;

  const base = preset.fn(0, { a: amplitude, b: frequency, c: 0, d: 0 });
  const shifted = preset.fn(0, { a: amplitude, b: frequency, c: 3, d: 2 });

  expect(base).toBeCloseTo(0, 5);
  expect(shifted).toBeCloseTo(5, 5);
});

test('stage 4 starts gameplay with the timer and combo HUD', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponential master/i }));
  expect(screen.getByRole('heading', { name: /exponential functions/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /continue/i }));

  expect(screen.getByLabelText('Time remaining 03:00')).toBeInTheDocument();
  expect(screen.getByLabelText('Time elapsed 00:00')).toBeInTheDocument();
  expect(screen.getByLabelText('1 times multiplier, 0 hit streak')).toBeInTheDocument();
});

test('stars reflect health, hit rate, and the two-minute goal threshold', () => {
  expect(calculateStars({ won: true, lives: 2, hitRate: 80, elapsedSeconds: 120 })).toBe(3);
  expect(calculateStars({ won: true, lives: 1, hitRate: 79.9, elapsedSeconds: 121 })).toBe(0);
  expect(calculateStars({ won: false, lives: 3, hitRate: 100, elapsedSeconds: 60 })).toBe(0);
});

test('firing an equation animates a slash and restores the live preview', () => {
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const pauseSound = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation();
  const { container, unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponential master/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  fireEvent.click(screen.getByRole('button', { name: /fire equation/i }));

  const firedCurve = container.querySelector('.fired-curve.exponential-fired');
  expect(firedCurve).toBeInTheDocument();
  expect(container.querySelector('.live-curve')).not.toBeInTheDocument();

  fireEvent.animationEnd(firedCurve);
  expect(container.querySelector('.live-curve')).toBeInTheDocument();

  unmount();
  playSound.mockRestore();
  pauseSound.mockRestore();
});
