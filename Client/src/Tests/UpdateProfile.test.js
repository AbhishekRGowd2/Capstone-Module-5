import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateProfile from '../pages/UpdateProfile';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';

// Mock Redux hooks and Formik
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

// Mock fetch API
global.fetch = jest.fn();

describe('UpdateProfile Component', () => {
  const mockDispatch = jest.fn();
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    // Mock Redux hooks
    useSelector.mockImplementation(callback => callback({
      auth: { user: mockUser }
    }));
    useDispatch.mockReturnValue(mockDispatch);

    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => 
      key === 'token' ? 'mock-token' : JSON.stringify(mockUser)
    );

    // Mock fetch responses
    fetch.mockImplementation((url) => {
      if (url.includes('/api/profile')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      }
      if (url.includes('/auth/update')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser)
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the update profile form', () => {
    render(<UpdateProfile />);
    
    expect(screen.getByText('Update Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<UpdateProfile />);
    
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('submits the form successfully', async () => {
    render(<UpdateProfile />);
    
    // Fill out required fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Address Line 1'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('Zipcode'), { target: { value: '10001' } });

    // Mock alert
    global.alert = jest.fn();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(global.alert).toHaveBeenCalledWith('Profile and user info updated successfully!');
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('handles API errors', async () => {
    // Mock failed profile update
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Profile update failed' })
      })
    );

    render(<UpdateProfile />);
    
    // Fill out required fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Address Line 1'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('Zipcode'), { target: { value: '10001' } });

    // Mock alert
    global.alert = jest.fn();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Profile error: Profile update failed');
    });
  });
});