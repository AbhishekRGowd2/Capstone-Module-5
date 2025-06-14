import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/Signup';
import { toast } from 'react-toastify';
import authService from '../services/authServices';

jest.mock('../services/authServices', () => ({
  signup: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Signup Component', () => {
  test('fills out form and submits successfully', async () => {
    authService.signup.mockResolvedValueOnce({ data: { message: 'Signup successful' } });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { name: 'name', value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contact Number/i), { target: { name: 'contactNumber', value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { name: 'password', value: 'secret123' } });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        contactNumber: '1234567890',
        password: 'secret123',
      });
      expect(toast.success).toHaveBeenCalledWith('Signup successful');
    });
  });

  test('shows error toast on signup failure', async () => {
    authService.signup.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } }
    });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { name: 'name', value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { name: 'email', value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contact Number/i), { target: { name: 'contactNumber', value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { name: 'password', value: 'mypassword' } });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });
});
