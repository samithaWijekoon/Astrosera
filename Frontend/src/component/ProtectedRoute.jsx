import React from 'react';
import { useUser } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in font-outfit mt-16">
                <div className="w-24 h-24 mb-6 rounded-full bg-purple-900/20 shadow-[0_0_30px_rgba(168,85,247,0.2)] border border-purple-500/30 flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Astronaut Access Required</h2>
                <p className="text-gray-400 max-w-md mb-8">
                    You've discovered a restricted sector of the Astrosera network. Please sign in to your command center to access interactive features and live NASA feeds.
                </p>
                <div className="flex gap-4 flex-col sm:flex-row">
                    <Link to="/login" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                        Sign In Now
                    </Link>
                    <Link to="/" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all">
                        Return to Earth
                    </Link>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
