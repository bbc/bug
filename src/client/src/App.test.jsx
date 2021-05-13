import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders BUG home page.', async () => {
  await render(<App />);
  const styleProvider = screen.toHaveClass('makeStyles-root-1');
  expect(styleProvider).toBeInTheDocument();
});
