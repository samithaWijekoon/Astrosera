import React from 'react';
import { FaArrowRight } from "react-icons/fa";

const GetStartedSection = () => {
    const steps = [
        {
            number: 1,
            title: "Sign Up Free",
            description: "Create your account in 30 seconds"
        },
        {
            number: 2,
            title: "Set Location",
            description: "Enable location for personalized events"
        },
        {
            number: 3,
            title: "Start Exploring",
            description: "Ask Astra-Bot anything about space"
        }
    ];

    return (
        <section
            className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center py-16 px-6 font-sans"
            style={{
                // Ensure images/img5.png is in your public folder
                backgroundImage: "url('/images/img5.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto text-center">

                {/* Main Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 tracking-tight">
                    Get Started in 3 simple steps
                </h2>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 flex flex-col items-center hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group"
                        >
                            {/* Step Number */}
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold mb-5 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                {step.number}
                            </div>

                            {/* Step Title */}
                            <h3 className="text-xl text-white font-bold mb-2">
                                {step.title}
                            </h3>

                            {/* Step Description */}
                            <p className="text-gray-400 text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold py-3 px-10 rounded-full flex items-center justify-center mx-auto transition-all duration-300 mb-4 cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-pulse hover:animate-none">
                    Start Your Journey <FaArrowRight className="ml-2" />
                </button>

                {/* Footer Text */}
                <p className="text-gray-500 text-xs">
                    No credit card required • Free forever plan
                </p>

            </div>
        </section>
    );
};

export default GetStartedSection;