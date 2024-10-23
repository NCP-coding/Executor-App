import { act, render, screen } from '@testing-library/react';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';
import MetaContextProvider from '@/context';

test('renders Executor App', async () => {
  await act(async () => {
    render(
      <MetaContextProvider>
            <Router>
              <App />
            </Router>
      </MetaContextProvider>
    )
  }); 
  const linkElement = screen.getByText(/Executor App/i);
  expect(linkElement).toBeInTheDocument();
});
