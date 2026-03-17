import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });
    const { signup, googleLogin } = useContext(AuthContext);
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        setPasswordRules({
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            number: /\d/.test(val),
            specialChar: /[@$!%*?&#]/.test(val),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        const isPasswordValid = Object.values(passwordRules).every(Boolean);
        if (!isPasswordValid) {
            return setError("Please ensure your password meets all requirements.");
        }

        const result = await signup(username, email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        const result = await googleLogin(credentialResponse.credential);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black font-outfit py-12">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join the Astrosera community</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg p-3 mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <div className="mt-2 text-xs space-y-1">
                            <p className={passwordRules.length ? "text-green-500" : "text-red-500"}>
                                {passwordRules.length ? "✓" : "✗"} Minimum 8 characters
                            </p>
                            <p className={passwordRules.uppercase ? "text-green-500" : "text-red-500"}>
                                {passwordRules.uppercase ? "✓" : "✗"} At least one uppercase letter
                            </p>
                            <p className={passwordRules.number ? "text-green-500" : "text-red-500"}>
                                {passwordRules.number ? "✓" : "✗"} At least one number
                            </p>
                            <p className={passwordRules.specialChar ? "text-green-500" : "text-red-500"}>
                                {passwordRules.specialChar ? "✓" : "✗"} At least one special character (@, #, $, %, etc.)
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transform hover:-translate-y-0.5"
                    >
                        Sign Up
                    </button>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or get started with</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Sign-In failed to initialize.')}
                            theme="filled_black"
                            width="100%"
                            size="large"
                            text="signup_with"
                        />
                    </div>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
