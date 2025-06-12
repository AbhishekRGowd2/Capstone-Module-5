import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import PatientDashboard from '../pages/Dashboard';

// Mock axios
jest.mock('axios');

describe('PatientDashboard', () => {
  test('renders loading state and then patient profile fields', async () => {
    // Setup mock response data
    const mockProfile = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'john@example.com',
      address1: '123 Street',
      address2: 'Apt 4',
      city: 'Cityville',
      state: 'Stateland',
      zipcode: '12345',
    };

    // Mock axios.get to resolve with mockProfile
    axios.get.mockResolvedValueOnce({ data: mockProfile });

    render(<PatientDashboard />);

    // Initially loading text should be shown
    expect(screen.getByText(/Loading profile/i)).toBeInTheDocument();

    // Wait for the loading to finish and profile fields to appear
    await waitFor(() => {
      expect(screen.getByText(/John/)).toBeInTheDocument();
      expect(screen.getByText(/Doe/)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    });
  });
});
