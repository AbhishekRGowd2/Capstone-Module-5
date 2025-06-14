import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateProfile from '../pages/UpdateProfile';
import { useSelector, useDispatch } from 'react-redux';
import profileService from '../services/profileServices';
import authService from '../services/authServices';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

// Mock services
jest.mock('../services/profileServices', () => ({
  updateProfile: jest.fn()
}));
jest.mock('../services/authServices', () => ({
  updateUser: jest.fn()
}));

// Setup global alert mock
global.alert = jest.fn();

describe('UpdateProfile Component', () => {
  const mockDispatch = jest.fn();
  const mockUser = {
    _id: '12345',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    useSelector.mockImplementation(callback =>
      callback({ auth: { user: mockUser } })
    );
    useDispatch.mockReturnValue(mockDispatch);

    profileService.updateProfile.mockResolvedValue({ data: { success: true } });
    authService.updateUser.mockResolvedValue({ data: mockUser });

    Storage.prototype.getItem = jest.fn(key =>
      key === 'token' ? 'mock-token' : JSON.stringify(mockUser)
    );
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

    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Address Line 1'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('Zipcode'), { target: { value: '10001' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(profileService.updateProfile).toHaveBeenCalled();
      expect(authService.updateUser).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Profile and user info updated successfully!');
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('handles API errors', async () => {
    profileService.updateProfile.mockRejectedValue({
      response: { data: { message: 'Profile update failed' } }
    });

    render(<UpdateProfile />);

    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Address Line 1'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('State'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText('Zipcode'), { target: { value: '10001' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Profile error: Profile update failed');
    });
  });
});
