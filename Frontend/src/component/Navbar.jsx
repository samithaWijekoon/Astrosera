import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { name: 'Main', id: 'main' },
        { name: 'About', id: 'about' },
        { name: 'Chat', id: 'chat' },
        { name: 'News', id: 'news' },
        { name: 'Dashboard', id: 'dashboard' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false); // Close mobile menu if open
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 py-6 font-outfit bg-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative">

                {/* Logo - Left Aligned */}
                <button onClick={() => scrollToSection('main')} className="flex items-center flex-shrink-0 cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none">
                    <img src="/logo.png" alt="Astrosera Logo" className="h-10 md:h-14 w-auto" />
                </button>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.id)}
                            className="text-gray-300 hover:text-white transition-all duration-300 text-sm uppercase tracking-wider font-medium hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] cursor-pointer bg-transparent border-none focus:outline-none"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Right Side - Button & Mobile Toggle */}
                <div className="flex items-center space-x-4">
                    {/* Get Started Button - Right Aligned (Desktop) */}
                    <button
                        onClick={() => scrollToSection('dashboard')}
                        className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer focus:outline-none"
                    >
                        Get Started
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white text-2xl focus:outline-none cursor-pointer"
                    >
                        {isOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 absolute top-full left-0 w-full p-6 flex flex-col space-y-4 shadow-2xl">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.id)}
                            className="text-gray-300 hover:text-white text-lg font-medium border-b border-white/5 pb-2 text-left bg-transparent focus:outline-none"
                        >
                            {link.name}
                        </button>
                    ))}
                    <button
                        onClick={() => scrollToSection('dashboard')}
                        className="bg-purple-600 text-white text-center font-bold py-3 rounded-xl mt-4 focus:outline-none"
                    >
                        Get Started
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
