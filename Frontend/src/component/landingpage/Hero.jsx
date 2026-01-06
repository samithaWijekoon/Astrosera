import React from 'react';
import { Link } from 'react-router-dom'; // Make sure react-router-dom is installed
import { IoIosRocket, IoMdCheckmarkCircleOutline } from "react-icons/io"; // Install react-icons

const Hero = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="/videos/back.mp4" // Ensure back.mp4 is in your public folder
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Overlay for better readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

            {/* Navigation removed - moved to Navbar.jsx */}

            {/* Hero Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4 md:px-0 pb-32 pt-40 md:pt-24 font-outfit">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight animate-fade-in-up">Astrosera</h1>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-6 animate-fade-in-up delay-100">
                    Explore the Universe with <span className="text-purple-400">AI-Powered Accuracy</span>
                </h2>
                <p className="text-lg md:text-xl max-w-2xl mb-10 text-gray-200 animate-fade-in-up delay-200">
                    Get accurate astronomy answers, track celestial events, and learn through gamified quizzes—all powered by NASA-verified data with RAG technology.
                </p>
                <div className="flex space-x-4 mb-12 animate-fade-in-up delay-300">
                    <button className="bg-purple-600/30 backdrop-blur-xl border border-white/10 hover:bg-purple-600/50 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg shadow-purple-900/20 transform hover:scale-105">
                        Get Started Free
                    </button>
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
                        Login
                    </button>
                </div>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-sm md:text-base animate-fade-in-up delay-300">
                    <div className="flex items-center">
                        <IoMdCheckmarkCircleOutline className="text-green-400 text-xl mr-2" />
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center">
                        <IoMdCheckmarkCircleOutline className="text-green-400 text-xl mr-2" />
                        <span>Free forever plan</span>
                    </div>
                    <div className="flex items-center">
                        <IoMdCheckmarkCircleOutline className="text-green-400 text-xl mr-2" />
                        <span>Setup in 30 seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;