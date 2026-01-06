import React from 'react';

const LocationFeature = () => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center font-sans">

            {/* --- Background Video --- */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-70"
            >
                <source src="/videos/back3.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay for Text Readability */}
            {/* The image has a vignette feel, so we use a radial gradient */}
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.9)_100%)]"></div>

            {/* --- Main Content --- */}
            <div className="relative z-20 container mx-auto px-6 text-center max-w-5xl flex flex-col items-center justify-center h-full">

                {/* Headlines */}
                <div className="mb-8">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                        <span className="text-[#22c55e] block mb-2 md:mb-4 drop-shadow-lg">
                            Never Miss a Space Event
                        </span>
                        <span className="text-white block drop-shadow-lg">
                            Personalized for Your Location
                        </span>
                    </h2>
                </div>

                {/* Description Paragraph */}
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
                    Intelligent timezone conversion and location-based filtering ensures you only see
                    events visible from where you are, with precise viewing instructions.
                </p>
            </div>

            {/* --- Floating Notification Widget (Bottom Left) --- */}
            <div className="relative mt-12 md:absolute md:mt-0 md:bottom-24 md:left-24 z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-4 bg-[#064e3b]/80 backdrop-blur-md border border-green-500/30 p-4 pr-8 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)]">

                    {/* Rocket Icon Container */}
                    <div className="bg-green-900/50 p-2.5 rounded-xl border border-green-500/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6 text-green-400"
                        >
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                        </svg>
                    </div>

                    {/* Widget Text */}
                    <div className="text-left">
                        <div className="text-green-400/80 text-[10px] md:text-xs uppercase font-bold tracking-widest mb-0.5">Next Event</div>
                        <div className="text-white font-semibold text-sm md:text-base tracking-wide">ISS Pass - 8:45 PM</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LocationFeature;