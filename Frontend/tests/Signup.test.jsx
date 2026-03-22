import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Signup from '../src/Pages/Signup';
import AuthContext from '../src/context/AuthContext';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <button data-testid="google-btn">Google Login</button>,
}));

describe('Signup Component', () => {
  const mockSignup = vi.fn();
  const mockGoogleLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignup = () => {
    return render(
      <AuthContext.Provider value={{ signup: mockSignup, googleLogin: mockGoogleLogin }}>
        <Signup />
      </AuthContext.Provider>
    );
  };

  it('renders correctly', () => {
    renderSignup();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
  });

  it('simulates typing into input fields and handles password requirements', () => {
    renderSignup();
    const usernameInput = screen.getByPlaceholderText('Choose a username');
    const passwordInput = screen.getByPlaceholderText('Create a password');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass1!' } });

    expect(usernameInput.value).toBe('newuser');
    expect(passwordInput.value).toBe('StrongPass1!');
  });

  it('shows error if passwords do not match', async () => {
    renderSignup();
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'Pass1!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Fail1!' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('calls signup when inputs are valid', async () => {
    mockSignup.mockResolvedValue({ success: true });
    renderSignup();
    
    fireEvent.change(screen.getByPlaceholderText('Choose a username'), { target: { value: 'user123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'u@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { target: { value: 'ValidPass1!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'ValidPass1!' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }).closest('form'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('user123', 'u@example.com', 'ValidPass1!');
    });
  });
});
