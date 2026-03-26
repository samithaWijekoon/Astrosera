import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const backendUrl = import.meta.env.VITE_API_URL;

const API_BASE = backendUrl;

const VerifyEmail = () => {
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    // The backend URL is matched to what AuthContext uses
    const backendurl = API_BASE;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (otpCode.length !== 6) {
            return setError('Please enter a valid 6-digit code.');
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${backendurl}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp_code: otpCode }),
            });

            const data = await response.json();

            if (response.ok) {
                // OTP is correct! Try to auto-login using the temporarily stored password
                const storedEmail = sessionStorage.getItem('pending_otp_email');
                const storedPassword = sessionStorage.getItem('pending_otp_password');

                if (storedEmail && storedPassword && storedEmail === email) {
                    // Credentials available — log the user in automatically
                    setSuccess('✅ Email verified! Logging you in...');
                    // Clear sensitive data from sessionStorage immediately
                    sessionStorage.removeItem('pending_otp_email');
                    sessionStorage.removeItem('pending_otp_password');

                    const loginResult = await login(storedEmail, storedPassword);
                    if (!loginResult.success) {
                        // If auto-login fails for any reason, fall back to manual login
                        setSuccess('✅ Email verified! Please sign in to continue.');
                        setTimeout(() => navigate('/login'), 2000);
                    }
                    // If login succeeded, AuthContext will navigate to '/' automatically
                } else {
                    // No stored password (e.g. user refreshed the page) — redirect to login
                    setSuccess('✅ Email verified! Please sign in to continue.');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                setError(data.detail || data.message || 'Invalid code. Please try again.');
            }
        } catch (err) {
            setError('Server error or connection refused.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            return setError('No email address found to resend the code.');
        }

        setIsResending(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${backendurl}/api/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('A new verification code has been sent to your email.');
            } else {
                setError(data.message || 'Failed to resend code. Please try again.');
            }
        } catch (err) {
            setError('Server error while resending code.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black font-outfit py-12">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📬</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                    <p className="text-gray-400">
                        We sent a 6-digit code to <span className="text-purple-400 font-medium">{email || 'your email address'}</span>.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 mb-6 text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm rounded-lg p-3 mb-6 text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center tracking-widest uppercase">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full px-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            placeholder="000000"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transform hover:-translate-y-0.5"
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
                    </button>

                    <div className="mt-8 text-center text-gray-400 text-sm">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            className={`font-medium transition-colors ${isResending ? 'text-gray-500 cursor-not-allowed' : 'text-purple-400 hover:text-purple-300'
                                }`}
                            onClick={handleResend}
                            disabled={isResending}
                        >
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
