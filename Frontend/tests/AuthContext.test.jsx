import React, { useContext } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider, useUser } from '../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// A dummy component to consume the AuthContext and expose its functions to our tests
const DummyComponent = () => {
  const { user, login, signup, logout, googleLogin, updateUser, saveEmail, email } = useUser();

  return (
    <div>
      <div data-testid="user-state">{user ? user.username : 'None'}</div>
      <div data-testid="email-state">{email}</div>
      <button onClick={() => saveEmail('test@email.com')}>Save Email</button>
      <button onClick={() => login('test@example.com', 'pass123')}>Login Submit</button>
      <button onClick={() => signup('user1', 'u@test.com', 'pass123')}>Signup Submit</button>
      <button onClick={() => googleLogin('google-token-123')}>Google Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => updateUser({ username: 'updated_user', _id: '5678', token: 'new-token' })}>Update User</button>
    </div>
  );
};

describe('AuthContext Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();
    window.sessionStorage.setItem = vi.fn();
  });

  const renderAuth = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <DummyComponent />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('initializes from localStorage', () => {
    Storage.prototype.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify({ username: 'stored_user', _id: '1234' });
      if (key === 'astrosera_email') return 'stored@email.com';
      return null;
    });

    renderAuth();
    expect(screen.getByTestId('user-state')).toHaveTextContent('stored_user');
    expect(screen.getByTestId('email-state')).toHaveTextContent('stored@email.com');
  });

  it('handles invalid user JSON gracefully', () => {
    Storage.prototype.getItem.mockImplementation((key) => {
      if (key === 'user') return 'invalid-json';
      return null;
    });

    renderAuth();
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('user');
    expect(screen.getByTestId('user-state')).toHaveTextContent('None');
  });

  it('handles successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ username: 'logged_in_user', token: 'tok', _id: '123' })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Login Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('logged_in_user');
      expect(Storage.prototype.setItem).toHaveBeenCalledWith('user', expect.any(String));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles generic login failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Bad credentials' })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Login Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('None');
    });
  });

  it('handles 403 Unverified Email redirect', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ message: 'Email not verified' })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Login Submit'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verify-email?email=test%40example.com');
    });
  });
  
  it('handles fetch exception returning offline message', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    renderAuth();
    fireEvent.click(screen.getByText('Login Submit'));
    // Context returns object with message quietly on exception without crashing
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('None');
    });
  });

  it('handles successful registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Signup Submit'));

    await waitFor(() => {
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('pending_otp_email', 'u@test.com');
      expect(mockNavigate).toHaveBeenCalledWith('/verify-email?email=u%40test.com');
    });
  });
  
  it('handles registration failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'User already exists' })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Signup Submit'));

    await waitFor(() => {
      expect(window.sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  it('handles google login success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ username: 'google_user', _id: '12', token: 'google-tok' })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Google Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('google_user');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  
  it('handles google login failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid Google Token' })
    });

    renderAuth();
    fireEvent.click(screen.getByText('Google Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('None');
    });
  });

  it('allows manual saveEmail triggering', () => {
    renderAuth();
    fireEvent.click(screen.getByText('Save Email'));
    expect(screen.getByTestId('email-state')).toHaveTextContent('test@email.com');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('astrosera_email', 'test@email.com');
  });

  it('updates user state smoothly', () => {
    renderAuth();
    fireEvent.click(screen.getByText('Update User'));
    expect(screen.getByTestId('user-state')).toHaveTextContent('updated_user');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('token', 'new-token');
  });

  it('clears storage and navigates away on logout', () => {
    renderAuth();
    fireEvent.click(screen.getByText('Logout'));
    
    expect(screen.getByTestId('user-state')).toHaveTextContent('None');
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('user');
    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

});
