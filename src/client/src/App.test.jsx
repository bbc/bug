import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders BUG home page.', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to BUG/i);
  expect(linkElement).toBeInTheDocument();
});
