import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import authService from '../services/authServices';

// Mock Redux dispatch
jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}));

// Mock authService
jest.mock('../services/authServices');

const mockDispatch = jest.fn();

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.spyOn(Storage.prototype, 'setItem'); // mock localStorage.setItem
    jest.clearAllMocks();
  });

  test('submits login form and calls authService.login', async () => {
    const mockResponse = {
      data: {
        user: { id: 1, email: 'test@example.com' },
        token: 'fake-token'
      }
    };

    authService.login.mockResolvedValue(mockResponse);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /^login$/i })); // ✅ safer and specific

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.data.token);
    });
  });
});
