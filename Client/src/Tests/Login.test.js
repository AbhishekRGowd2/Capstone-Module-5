import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login', () => {
  test('submits login form and calls axios.post', async () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);

    axios.post.mockResolvedValueOnce({
      data: {
        user: { id: 1, email: 'test@example.com' },
        token: 'fake-token'
      }
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/auth/login',
        { email: 'test@example.com', password: 'password123' }
      );
    });
  });
});
