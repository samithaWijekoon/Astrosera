import React from 'react';
import { FiTwitter } from 'react-icons/fi';
import { FiInstagram } from 'react-icons/fi';
import { FiArrowRight } from 'react-icons/fi';
import { IoRocketOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Footer = () => {
    // Data for footer links configured to the requested destinations
    const footerSections = [
        {
            title: "Product",
            links: [
                { name: "Home", url: "/", isExternal: false },
                { name: "Features", url: "/", isExternal: false },
                { name: "Astra-Bot", url: "/chat", isExternal: false },
                { name: "Daily Quiz", url: "/quiz", isExternal: false },
                { name: "Event Calendar", url: "/events", isExternal: false },
                { name: "Pricing", url: "/#pricing", isExternal: false }
            ]
        },
        {
            title: "Connect",
            links: [
                { name: "Contact", url: "https://instagram.com/astrosera", isExternal: true },
                { name: "Community", url: "https://instagram.com/astrosera", isExternal: true }
            ]
        }
    ];

    return (
        <footer className="w-full relative z-50 overflow-hidden bg-black font-sans border-t border-white/5 pt-20 pb-10">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                
                {/* Top Section: Brand & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-16 mb-16 gap-10">
                    <div className="max-w-md">
                        <div className="flex items-center text-white text-3xl font-extrabold mb-4 tracking-tight drop-shadow-md">
                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-purple-900/50">
                                <IoRocketOutline className="text-white" size={28} />
                            </div>
                            <span>Astrosera</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                            Your AI-powered gateway to the universe. Explore space with accuracy, engagement, and gamified learning.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto">
                        <h4 className="text-white font-bold mb-3">Join our cosmic newsletter</h4>
                        <div className="flex items-center w-full max-w-md bg-white/5 border border-white/10 rounded-full p-1.5 focus-within:border-purple-500/50 focus-within:bg-white/10 transition-all duration-300">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="bg-transparent text-white px-4 py-2 w-full outline-none text-sm placeholder-gray-500"
                            />
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-2.5 px-6 font-semibold text-sm hover:scale-105 transition-transform flex items-center justify-center min-w-max shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Link Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {/* Navigation Columns */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="col-span-1">
                            <h4 className="text-white font-bold mb-6 text-base tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                {section.title}
                            </h4>
                            <ul className="space-y-4 text-sm font-medium">
                                {section.links.map((link, i) => (
                                    <li key={i} className="group">
                                        {link.isExternal || link.url.startsWith('/#') ? (
                                            <a 
                                                href={link.url} 
                                                target={link.isExternal ? "_blank" : "_self"} 
                                                rel={link.isExternal ? "noopener noreferrer" : ""} 
                                                className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300 flex items-center inline-block"
                                            >
                                                <FiArrowRight className="inline opacity-0 -ml-4 mr-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-purple-500" />
                                                {link.name}
                                            </a>
                                        ) : (
                                            <Link 
                                                to={link.url} 
                                                className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300 flex items-center inline-block"
                                            >
                                                <FiArrowRight className="inline opacity-0 -ml-4 mr-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-purple-500" />
                                                {link.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium tracking-wide">
                    <div className="mb-4 md:mb-0 text-gray-500 font-mono">
                        &copy; 2026 Astrosera Inc. All rights reserved.
                    </div>
                    
                    {/* Social Icons */}
                    <div className="flex space-x-4">
                        <a aria-label="Link" href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300">
                            <FiTwitter size={18} />
                        </a>
                        <a aria-label="Link" href="https://instagram.com/astrosera" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600/20 hover:border-pink-500/50 transition-all duration-300">
                            <FiInstagram size={18} />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;