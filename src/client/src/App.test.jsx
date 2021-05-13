import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders BUG home page.', async () => {
  await render(<App />);
  const linkElement = screen.getByText(/Home/);
  expect(linkElement).toBeInTheDocument();
});
