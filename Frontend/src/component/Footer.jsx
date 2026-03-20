import React from 'react';
import { FiTwitter, FiGithub, FiLinkedin, FiMail, FiInstagram } from "react-icons/fi";
import { IoRocketOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Footer = () => {
    // Data for footer links configured to the new requested destinations
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
        <footer className="w-full relative z-50 bg-[#050505]/80 backdrop-blur-2xl text-gray-400 py-16 font-sans border-t border-white/10">
            <div className="max-w-7xl mx-auto px-8 md:px-12">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">

                    {/* Brand Column (Spans 2 columns on lg screens) */}
                    <div className="col-span-1 md:col-span-2 pr-0 lg:pr-8">
                        <div className="flex items-center text-white text-xl font-bold mb-6 tracking-wide">
                            <IoRocketOutline className="text-gray-200 mr-2" size={24} />
                            <span>Astrosera</span>
                        </div>
                        <p className="text-gray-500 mb-8 leading-relaxed max-w-sm text-sm font-medium">
                            Your AI-powered gateway to the universe. Explore space with accuracy, engagement, and personalization.
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <FiInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="col-span-1">
                            <h4 className="text-gray-200 font-semibold mb-6 text-sm tracking-wide">{section.title}</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        {link.isExternal || link.url.startsWith('/#') ? (
                                            <a href={link.url} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : ""} className="text-gray-500 hover:text-gray-200 transition-colors duration-300 inline-block">
                                                {link.name}
                                            </a>
                                        ) : (
                                            <Link to={link.url} className="text-gray-500 hover:text-gray-200 transition-colors duration-300 inline-block">
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
                <div className="border-t border-white/5 pt-8 flex flex-col items-center justify-center text-xs font-medium tracking-wide">
                    <div className="text-gray-500 text-center">
                        &copy; 2026 Astrosera. All rights reserved.
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;