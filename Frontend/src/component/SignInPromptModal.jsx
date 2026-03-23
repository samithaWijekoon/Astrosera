import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SignInPromptModal = ({ isOpen, onClose, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-gray-900 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] overflow-hidden font-outfit"
                    >
                        {/* Background flare */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
                        
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-16 h-16 mb-4 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-500/50">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{title || "Authentication Required"}</h3>
                            <p className="text-gray-400 mb-6">{message || "Please sign in to your Astrosera account to access this feature."}</p>
                            
                            <div className="flex w-full gap-3">
                                <button 
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <Link 
                                    to="/login"
                                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] block"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SignInPromptModal;
