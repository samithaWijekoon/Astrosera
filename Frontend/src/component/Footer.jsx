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
        <footer className="w-full relative z-50 bg-[#050505]/80 backdrop-blur-2xl text-gray-400 py-16 font-sans border-t border-white/10">
            <div className="max-w-7xl mx-auto px-8 md:px-12">

                {/* Main Footer Content */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">

                    {/* Brand Column (Spans 2 columns on lg screens) */}
                    <div className="col-span-2 lg:col-span-2 pr-0 lg:pr-8">
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
                                <FiGithub size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <FiLinkedin size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300">
                                <FiMail size={20} />
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
                                        <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors duration-300 inline-block">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium tracking-wide">
                    <div className="mb-4 md:mb-0 text-gray-500">
                        &copy; 2024 Astrosera. All rights reserved.
                    </div>
                    <div className="flex space-x-8">
                        <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors duration-300">Terms of Use</a>
                        <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors duration-300">Legal</a>
                        <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors duration-300">Site Map</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;