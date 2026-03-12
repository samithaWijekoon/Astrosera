import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Port 5001 is required for your MacBook Air setup
const backendurl = "http://localhost:5001"; // Use localhost instead of 127.0.0.1

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            const response = await fetch(`${backendurl}/api/auth/login`, {
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
                return { success: false, message: data.message || "Invalid credentials" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Connection refused. Is the server running on port 5001?" };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const response = await fetch(`${backendurl}/api/auth/google`, {
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
            const response = await fetch(`${backendurl}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data._id);

                navigate('/');
                return { success: true };
            } else {
                return { success: false, message: data.message };
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
        <AuthContext.Provider value={{ user, login, signup, logout, googleLogin, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;