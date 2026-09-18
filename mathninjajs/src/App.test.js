import { render, screen } from '@testing-library/react';
import App from './App';
import PresetCard from './Components/PresetCards.jsx';

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
