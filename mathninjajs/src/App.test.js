import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import PresetCard from './Components/PresetCards.jsx';
import Timer from './Components/Timer.jsx';
import { stage2Presets } from './Game/Equations/StagePreset2.js';

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

  expect(screen.getByLabelText('Time remaining 00:45')).toBeInTheDocument();
  expect(screen.getByLabelText('Time elapsed 00:00')).toBeInTheDocument();
  expect(screen.getByLabelText('1 times multiplier, 0 hit streak')).toBeInTheDocument();
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

test('repeated miss effects use separate audio players so they can overlap', () => {
  const playedPlayers = [];
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () {
    playedPlayers.push(this);
    return Promise.resolve();
  });
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponential master/i }));
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
  const playSound = jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: /exponential master/i }));
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  playSound.mockClear();

  fireEvent.click(screen.getByRole('button', { name: /^back$/i }));

  expect(playSound).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('heading', { name: /exponential functions/i })).toBeInTheDocument();

  unmount();
  playSound.mockRestore();
});
