import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AVATARS = [
    { id: 'astronaut1', url: '👨‍🚀', name: 'Astronaut 1' },
    { id: 'astronaut2', url: '🧑‍🚀', name: 'Astronaut 2' },
    { id: 'alien1', url: '👽', name: 'Alien 1' },
    { id: 'alien2', url: '👾', name: 'Alien 2' },
    { id: 'rocket', url: '🚀', name: 'Rocket' },
    { id: 'satellite', url: '🛰️', name: 'Satellite' },
    { id: 'star', url: '⭐', name: 'Star' },
    { id: 'planet', url: '🪐', name: 'Planet' }
];

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatarInitials, setAvatarInitials] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setUsername(user.username || '');
        setEmail(user.email || '');
        setAvatarInitials(user.avatarInitials || '');
    }, [user, navigate]);

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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (password) {
            const isPasswordValid = Object.values(passwordRules).every(Boolean);
            if (!isPasswordValid) {
                setMessage({ text: 'Please ensure your new password meets all requirements.', type: 'error' });
                return;
            }
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username,
                    email,
                    avatarInitials,
                    ...(password && { password }),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                updateUser(data);
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                setPassword('');
                setPasswordRules({ length: false, uppercase: false, number: false, specialChar: false });
            } else {
                setMessage({ text: data.message || 'Failed to update profile.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Server error. Please try again later.', type: 'error' });
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] py-24 relative overflow-hidden font-outfit">
            <div className="h-full w-full absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Astronaut <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Profile</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Manage your intergalactic identity and settings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Stats & Avatar */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Gamification Stats */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <h3 className="text-xl font-bold text-white mb-4">Mission Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-gray-400">Total Score</span>
                                    <span className="text-2xl font-bold text-purple-400">{user.totalScore || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-gray-400">Streak</span>
                                    <span className="text-2xl font-bold text-pink-400">{user.streakCount || 0} 🔥</span>
                                </div>
                            </div>
                        </div>

                        {/* Current Avatar Display */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] text-center">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-600/50 to-pink-600/50 rounded-full flex items-center justify-center text-5xl border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-4">
                                {avatarInitials}
                            </div>
                            <h3 className="text-xl font-bold text-white">{username}</h3>
                            <p className="text-gray-400 mt-1 capitalize">{user.role || 'Explorer'}</p>
                        </div>
                    </div>

                    {/* Right Column - Settings Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                            
                            {message.text && (
                                <div className={`p-4 rounded-xl mb-6 text-sm ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {/* Avatar Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">Choose Avatar Icon</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                        {AVATARS.map((avatar) => (
                                            <button
                                                type="button"
                                                key={avatar.id}
                                                onClick={() => setAvatarInitials(avatar.url)}
                                                className={`text-2xl p-2 rounded-xl transition-all duration-300 ${avatarInitials === avatar.url ? 'bg-purple-600/50 border border-purple-500' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                                title={avatar.name}
                                            >
                                                {avatar.url}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Or enter initials below</p>
                                    <input
                                        type="text"
                                        maxLength="2"
                                        className="mt-2 w-20 text-center px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                        value={avatarInitials}
                                        onChange={(e) => setAvatarInitials(e.target.value)}
                                        placeholder="Initials"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-6">
                                    <h4 className="text-lg font-bold text-white mb-4">Security</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password (leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password"
                                        />
                                        
                                        {password && (
                                            <div className="mt-3 text-xs space-y-1">
                                                <p className={passwordRules.length ? "text-green-500" : "text-gray-500"}>
                                                    {passwordRules.length ? "✓" : "○"} Minimum 8 characters
                                                </p>
                                                <p className={passwordRules.uppercase ? "text-green-500" : "text-gray-500"}>
                                                    {passwordRules.uppercase ? "✓" : "○"} At least one uppercase letter
                                                </p>
                                                <p className={passwordRules.number ? "text-green-500" : "text-gray-500"}>
                                                    {passwordRules.number ? "✓" : "○"} At least one number
                                                </p>
                                                <p className={passwordRules.specialChar ? "text-green-500" : "text-gray-500"}>
                                                    {passwordRules.specialChar ? "✓" : "○"} At least one special character (@, #, $, %, etc.)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transform hover:-translate-y-0.5"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
