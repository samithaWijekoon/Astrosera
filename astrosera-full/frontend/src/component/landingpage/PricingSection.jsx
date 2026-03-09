import React from 'react';

const PricingSection = () => {
    return (
        // Main Container - Full viewport height, relative for absolute children
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">

            {/* --- Background Layers --- */}

            {/* 1. Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0 opacity-60"
            >
                <source src="/videos/back1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* 2. Grid and Dark Overlay */}
            {/* This simulates the perspective grid and dark vignette from the image */}
            <div
                className="absolute top-0 left-0 w-full h-full z-1"
                style={{
                    background: `
            radial-gradient(circle at center, transparent 0%, rgb(0 0 0 / 0.8) 100%),
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '100% 100%, 60px 60px, 60px 60px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                    transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
                    transformOrigin: 'top center',
                    pointerEvents: 'none'
                }}
            ></div>

            {/* A final dark fade layer to ensure text readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-2 pointer-events-none"></div>


            {/* --- Main Content --- */}
            <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-12 z-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Choose Your Mission
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Start exploring for free, upgrade when you're ready
                    </p>
                </div>

                {/* Pricing Cards Container - Stacks on mobile, side-by-side on Desktop (md) */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-4xl relative z-20">

                    {/* Astronaut Image - Floating absolute position */}
                    {/* Positioned relative to the pricing container so it moves with layout */}
                    <img
                        src="images/astronout.png"
                        alt="Astronaut floating"
                        className="absolute -left-10 -bottom-10 w-48 md:w-80 md:-left-56 md:bottom-0 lg:w-[500px] lg:-left-[400px] lg:-bottom-20 pointer-events-none z-0 opacity-90 mix-blend-lighten transform rotate-12"
                    />

                    {/* --- Free Card (Explorer) --- */}
                    <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col relative z-10">
                        <h3 className="text-2xl font-semibold mb-2">Explorer</h3>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">Free</span>
                            <span className="text-gray-400 ml-2">forever</span>
                        </div>

                        {/* Feature List */}
                        <ul className="space-y-4 mb-8 flex-grow text-gray-300 text-sm">
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>Daily space quiz</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>Latest space news</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>5 AI questions per day</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3"></span>Local sky events</li>
                        </ul>

                        <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-semibold">
                            Get Started
                        </button>
                    </div>

                    {/* --- Paid Card (Commander) --- */}
                    <div className="flex-1 relative bg-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col border border-purple-500/30 shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)] z-10">

                        {/* Most Popular Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                Most Popular
                            </span>
                        </div>

                        <h3 className="text-2xl font-semibold mb-2 mt-2">Commander</h3>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">$2.99</span>
                            <span className="text-gray-400 ml-2">/month</span>
                        </div>

                        {/* Feature List */}
                        <ul className="space-y-4 mb-8 flex-grow text-gray-300 text-sm">
                            <li className="font-semibold text-white mb-2">Everything in Explorer, plus:</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>Unlimited AI questions</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>Full conversation history</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>Advanced search & filters</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>Pro badges & leaderboard priority</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>Early access to new features</li>
                        </ul>

                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all font-semibold shadow-lg shadow-purple-900/30">
                            Upgrade Now
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PricingSection;