import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Chat', path: '/chat' },
        { name: 'Events', path: '/events' },
        { name: 'Quiz', path: '/quiz' },
        { name: 'Achievements', path: '/achievements' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'News', path: '/news' },
    ];

    const isActive = (path) => {
        return location.pathname === path ? 'text-purple-400' : 'text-gray-300';
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 py-6 font-outfit bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative">

                {/* Logo - Left Aligned */}
                <Link to="/" className="flex items-center flex-shrink-0 cursor-pointer focus:outline-none">
                    <img src="/logo.png" alt="Astrosera Logo" className="h-10 md:h-14 w-auto" />
                </Link>

                {/* Desktop Navigation - Centered */}
                <div className="hidden lg:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`${isActive(link.path)} hover:text-white transition-all duration-300 text-sm uppercase tracking-wider font-medium hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side - Button & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    {/* Get Started Button - Right Aligned (Desktop) */}
                    <Link
                        to="/dashboard"
                        className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] focus:outline-none"
                    >
                        Get Started
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden text-white text-2xl focus:outline-none cursor-pointer"
                    >
                        {isOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 absolute top-full left-0 w-full p-6 flex flex-col space-y-4 shadow-2xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`${isActive(link.path)} hover:text-white text-lg font-medium border-b border-white/5 pb-2 text-left focus:outline-none`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="bg-purple-600 text-white text-center font-bold py-3 rounded-xl mt-4 focus:outline-none"
                    >
                        Get Started

                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
