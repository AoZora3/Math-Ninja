import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the title screen', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /^MATH$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
});
