import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/Signup'; // adjust path as needed
import axios from 'axios';
import { toast } from 'react-toastify';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Signup Component', () => {
  test('fills out form and submits successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Signup successful' } });

    render(<Signup />);

    // Fill out form inputs
    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { name: 'name', value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { name: 'email', value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact Number/i), {
      target: { name: 'contactNumber', value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { name: 'password', value: 'secret123' },
    });

    // Submit form
    fireEvent.click(screen.getByText(/Register/i));

    // Wait for axios call and toast
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/auth/signup', {
        name: 'John Doe',
        email: 'john@example.com',
        contactNumber: '1234567890',
        password: 'secret123',
      });
      expect(toast.success).toHaveBeenCalledWith('Signup successful');
    });
  });

  test('shows error toast on signup failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } }
    });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/Name/i), {
      target: { name: 'name', value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { name: 'email', value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Contact Number/i), {
      target: { name: 'contactNumber', value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { name: 'password', value: 'mypassword' },
    });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });
});
