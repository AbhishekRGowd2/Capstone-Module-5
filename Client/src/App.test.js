import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {store} from './Redux/store';  // your redux store
import App from './App';

test('renders login page (default route)', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Use a more specific query to avoid multiple matches
  const loginHeading = screen.getByRole('heading', { name: /login/i });
  expect(loginHeading).toBeInTheDocument();
});
