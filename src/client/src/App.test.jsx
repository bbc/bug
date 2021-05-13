import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders BUG home page.', async () => {
  await render(<App />);
  const bodyElement = screen.getByElement(/<body>/);
  expect(bodyElement).toBeInTheDocument();
});
