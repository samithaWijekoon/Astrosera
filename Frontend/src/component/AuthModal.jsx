import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, message }) => {
    const navigate = useNavigate();

    // Do not render anything if not open
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative bg-[#0d0a1a] border border-purple-500 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                        
                        <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-500/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <span className="text-3xl">🔒</span>
                        </div>

                        <h3 className="font-outfit text-2xl font-bold text-white tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Authentication Required
                        </h3>
                        
                        <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                            {message}
                        </p>

                        <button 
                            onClick={() => {
                                onClose();
                                navigate('/login');
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] uppercase tracking-wider text-sm cursor-pointer"
                        >
                            Sign In
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
