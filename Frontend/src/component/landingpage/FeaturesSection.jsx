import React from 'react';
import { FaCircle } from "react-icons/fa"; // Using font awesome for the simple bullet circles

const FeaturesSection = () => {
    return (
        <section
            className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-20"
            style={{
                backgroundColor: '#0a0a0a',
                backgroundImage: "url('/images/img2.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >

            {/* Grid Container for Content */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full font-outfit">

                {/* Left Column: Daily Quiz (Bottom alignment style) */}
                <div className="lg:col-span-4 order-3 lg:order-1 flex flex-col justify-end h-full">
                    <div className="mt-8 lg:mt-32  bg-black/20 p-6 rounded-2xl border border-white/5 shadow-xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up">
                            Daily Quiz Challenge
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Learn through gamified daily quizzes <br className="hidden md:block" />
                            with streak x and achievement badges
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start hover:translate-x-2 transition-transform duration-200">
                                <FaCircle className="text-blue-500 mt-1.5 mr-3 text-xs shrink-0 sh-glow" />
                                <span>3 new questions every 24 hours</span>
                            </li>
                            <li className="flex items-start hover:translate-x-2 transition-transform duration-200 delay-100">
                                <FaCircle className="text-blue-500 mt-1.5 mr-3 text-xs shrink-0 sh-glow" />
                                <span>Build streaks and unlock achievement badges</span>
                            </li>
                            <li className="flex items-start hover:translate-x-2 transition-transform duration-200 delay-200">
                                <FaCircle className="text-blue-500 mt-1.5 mr-3 text-xs shrink-0 sh-glow" />
                                <span>Track your performance and improvement</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Center Column: Spacer for Astronaut in Background */}
                <div className="lg:col-span-4 order-2 lg:order-2 h-64 lg:h-auto animate-float">
                    {/* Empty spacer to keep grid structure - astronaut is in bg image */}
                </div>

                {/* Right Column: Astra-Bot (Top alignment style) */}
                <div className="lg:col-span-4 order-1 lg:order-3 flex flex-col justify-start h-full">
                    <div className="mb-8 lg:mb-32  bg-black/20 p-6 rounded-2xl border border-white/5 shadow-xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up">
                            Astra-Bot Astronomy AI
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Get answers to any astronomy question with <br className="hidden md:block" />
                            &lt;2% error rate, powered by NASA-verified data
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start hover:translate-x-2 transition-transform duration-200">
                                <FaCircle className="text-purple-500 mt-1.5 mr-3 text-xs shrink-0 sh-glow" />
                                <span>RAG technology eliminates AI hallucination</span>
                            </li>
                            <li className="flex items-start hover:translate-x-2 transition-transform duration-200 delay-100">
                                <FaCircle className="text-purple-500 mt-1.5 mr-3 text-xs shrink-0 sh-glow" />
                                <span>Every answer includes source citations</span>
                            </li>
                            <li className="flex items-start hover:translate-x-2 transition-transform duration-200 delay-200">
                                <FaCircle className="text-purple-500 mt-1.5 mr-3 text-xs shrink-0 sh-glow" />
                                <span>ChatGPT-style conversational interface</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;