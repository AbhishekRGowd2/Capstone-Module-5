import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Layout from '../components/Layout';

// Dummy reducer with initial state for auth.user
const reducer = (state = { auth: { user: { name: 'Test User', email: 'test@example.com' } } }, action) => state;
const store = createStore(reducer);

describe('Layout component', () => {
    test('renders header and sidebar links', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Layout />
                </MemoryRouter>
            </Provider>
        );

        // Check header title
        expect(screen.getByText(/Patient System/i)).toBeInTheDocument();

        // Check user's name rendered
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();

        // Sidebar links - since sidebar is initially hidden on mobile (sidebarOpen=false), let's toggle it first
        // The toggle button with aria-label or role "button"
        const toggleButton = screen.getByRole('button', { name: /toggle sidebar menu/i });

        expect(toggleButton).toBeInTheDocument();

        // Click toggle button to open sidebar
        userEvent.click(toggleButton);

        // Now sidebar links should be visible
        expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Profile Settings/i })).toBeInTheDocument();

        // Logout button
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });
});
