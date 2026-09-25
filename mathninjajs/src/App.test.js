import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import PresetCard from './Components/PresetCards.jsx';
import { stage2Presets } from './Game/Equations/StagePreset2.js';

test('renders the title screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /^MATH$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
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
