import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../src/Pages/Login';
import AuthContext from '../src/context/AuthContext';

// Mock router Link
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock GoogleLogin to call the passed handlers based on dataset attributes
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <>
      <button data-testid="google-success-btn" onClick={() => onSuccess({ credential: 'fake_token' })}>
        Google Success
      </button>
      <button data-testid="google-error-btn" onClick={() => onError()}>
        Google Error
      </button>
    </>
  ),
}));

describe('Login Component', () => {
  const mockLogin = vi.fn();
  const mockGoogleLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin, googleLogin: mockGoogleLogin }}>
        <Login />
      </AuthContext.Provider>
    );
  };

  it('renders correctly', () => {
    renderLogin();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('simulates typing into input fields', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls login on form submit', async () => {
    mockLogin.mockResolvedValue({ success: true });
    
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(emailInput.closest('form'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message on failed login', async () => {
    mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' });
    
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.submit(emailInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles Google Sign-In success', async () => {
    mockGoogleLogin.mockResolvedValue({ success: true });
    renderLogin();

    fireEvent.click(screen.getByTestId('google-success-btn'));
    
    await waitFor(() => {
        expect(mockGoogleLogin).toHaveBeenCalledWith('fake_token');
    });
  });

  it('displays error on Google Sign-In backend verification failure', async () => {
    mockGoogleLogin.mockResolvedValue({ success: false, message: 'Google Auth backend error' });
    renderLogin();

    fireEvent.click(screen.getByTestId('google-success-btn'));
    
    await waitFor(() => {
        expect(screen.getByText('Google Auth backend error')).toBeInTheDocument();
    });
  });

  it('displays error on Google Sign-In initialization failure', async () => {
    renderLogin();

    fireEvent.click(screen.getByTestId('google-error-btn'));
    
    await waitFor(() => {
        expect(screen.getByText('Google Sign-In failed to initialize.')).toBeInTheDocument();
    });
  });
});
