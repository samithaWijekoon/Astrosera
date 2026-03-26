import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.VITE_API_URL;

const API_BASE = backendUrl;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState(() => localStorage.getItem('astrosera_email') || '');
    const navigate = useNavigate();

    function saveEmail(e) {
        setEmail(e);
        localStorage.setItem('astrosera_email', e);
    }

    useEffect(() => {
        // 1. Check for stored user on page load/refresh
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // 2. Safety Fix: Ensure userId is set for the Achievement page 
                // in case it was cleared but the user object remains.
                if (parsedUser._id && !localStorage.getItem('userId')) {
                    localStorage.setItem('userId', parsedUser._id);
                }
            } catch (error) {
                console.error("Error parsing stored user", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);

                // Unified Storage: Using localStorage so session persists
                // We save the ID in three places to ensure all team members' components work
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data._id);

                navigate('/');
                return { success: true };
            } else {
                const errorMessage = data.message || data.detail || "Invalid credentials";

                // If the user's email is not verified (HTTP 403)
                if (response.status === 403 && errorMessage.toLowerCase().includes("not verified")) {
                    navigate(`/verify-email?email=${encodeURIComponent(email)}`);
                    return { success: false, message: "Email not verified. Redirecting..." };
                }

                return { success: false, message: errorMessage };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Connection refused. Is the server running on port 5001?" };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credential }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);

                // Store identically to standard login
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data._id);

                navigate('/');
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Google Sign-In failed' };
            }
        } catch (error) {
            console.error('Google Login Error:', error);
            return { success: false, message: 'Server error during Google Sign-In' };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Temporarily store the password so VerifyEmail can auto-login after OTP
                sessionStorage.setItem('pending_otp_email', email);
                sessionStorage.setItem('pending_otp_password', password);
                // Return success so AuthContext can navigate
                navigate(`/verify-email?email=${encodeURIComponent(email)}`);
                return { success: true };
            } else {
                return { success: false, message: data.message || data.detail || 'Signup failed' };
            }
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, message: "Server error" };
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
        if (userData._id) {
            localStorage.setItem('userId', userData._id);
        }
    };

    const logout = () => {
        setUser(null);
        // Clear all storage keys to ensure a clean slate
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, googleLogin, updateUser, loading, email, saveEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── useUser hook (merged from UserContext) ───────────────────────────────────
export function useUser() { return useContext(AuthContext); }

export default AuthContext;