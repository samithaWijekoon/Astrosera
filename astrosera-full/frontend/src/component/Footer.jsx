import React from 'react';
import { FiTwitter, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { IoRocketOutline } from "react-icons/io5";

const Footer = () => {
    // Data for footer links to keep code clean
    const footerSections = [
        {
            title: "Product",
            links: ["Features", "Astra-Bot", "Daily Quiz", "Event Calendar", "Pricing"]
        },
        {
            title: "Company",
            links: ["About Us", "Blog", "Careers", "Press Kit", "Contact"]
        },
        {
            title: "Resources",
            links: ["Documentation", "Help Center", "Community", "API", "Status"]
        },
        {
            title: "Legal",
            links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Data Security"]
        }
    ];

    return (
        <footer className="w-full bg-black text-gray-400 py-12  font-sans">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">

                    {/* Brand Column (Spans 2 columns on lg screens) */}
                    <div className="col-span-2 lg:col-span-2 pr-0 lg:pr-8">
                        <div className="flex items-center text-white text-2xl font-bold mb-6">
                            <IoRocketOutline className="text-blue-500 mr-2" />
                            <span>Astrosera</span>
                        </div>
                        <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
                            Your AI-powered gateway to the universe. Explore space with accuracy, engagement, and personalization.
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white hover:shadow-[0_0_20px_rgba(29,161,242,0.4)]">
                                <FiTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:border-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                <FiGithub size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]">
                                <FiLinkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-purple-600 hover:border-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.4)]">
                                <FiMail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="col-span-1">
                            <h4 className="text-white font-semibold mb-6">{section.title}</h4>
                            <ul className="space-y-4 text-sm">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:text-purple-400 transition-all duration-200 hover:translate-x-1 inline-block">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <div className="mb-4 md:mb-0 text-gray-500">
                        &copy; 2024 Astrosera. All rights reserved. Powered by NASA data.
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-purple-400 transition-colors duration-200">Privacy</a>
                        <a href="#" className="hover:text-purple-400 transition-colors duration-200">Terms</a>
                        <a href="#" className="hover:text-purple-400 transition-colors duration-200">Cookies</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;