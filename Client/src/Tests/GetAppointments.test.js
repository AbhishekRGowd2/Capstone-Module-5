import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import GetAppointments from '../pages/GetAppointments';

jest.mock('axios');

describe('GetAppointments', () => {
  test('fetches and displays appointments', async () => {
    const mockData = [
      {
        datetime: '2024-06-05T10:00:00Z',
        doctor: { name: 'Dr. Smith' },
        department: 'Cardiology',
        rating: '4.9',
        profile: { firstName: 'John', lastName: 'Doe' }
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockData });
    localStorage.setItem('token', 'fake-token');

    render(<GetAppointments />);

    // Wait for appointment patient name to appear
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });
});
