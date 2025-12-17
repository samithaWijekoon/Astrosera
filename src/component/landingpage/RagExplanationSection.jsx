import React from 'react';
import { FaRobot, FaUser, FaDatabase } from "react-icons/fa";
import { FiSend, FiExternalLink, FiLayers } from "react-icons/fi";
import { BiAnalyse } from "react-icons/bi";

const RagExplanationSection = () => {
    return (
        // Main Container with Background Image
        <div
            className="relative min-h-screen w-full bg-[#0a0a0a] text-gray-100 flex items-center justify-center p-4 md:p-8 lg:p-12 font-outfit overflow-hidden"
        >
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60"
            >
                <source src="/videos/back2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-1 pointer-events-none"></div>

            {/* Content Grid */}
            <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">

                {/* LEFT COLUMN: Chatbot and Stats */}
                <div className="flex flex-col gap-6">

                    {/* Chatbot Interface Card */}
                    <div className="bg-gray-900/20 backdrop-blur-l border border-white/10 rounded-3xl p-5 overflow-hidden relative shadow-lg hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300">
                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-purple-600/60 p-2 rounded-full backdrop-blur-sm animate-pulse">
                                <FaRobot className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">Astra-Bot</h3>
                                <div className="flex items-center text-[10px] text-green-400">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    Online • NASA Verified
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="bg-white/5 rounded-2xl p-4 mb-4 text-xs md:text-sm leading-relaxed text-gray-200 space-y-3 backdrop-blur-sm border border-white/5">
                            <p>
                                Black holes form when massive stars (at least 20-25 times the mass of our Sun) reach the end of their life cycle and undergo gravitational collapse. When the star's nuclear fuel is exhausted, it can no longer support itself against its own gravity, causing the core to collapse inward at tremendous speeds.
                            </p>
                            <p>
                                This collapse continues until all the matter is compressed into an infinitely small point called a singularity, surrounded by an event horizon - the point of no return where even light cannot escape.
                            </p>
                        </div>

                        {/* Sources */}
                        <div className="mb-4">
                            <h4 className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Sources:</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <a href="#" className="flex items-center text-blue-400 hover:text-blue-300 transition bg-blue-500/10 px-2 py-1 rounded hover:bg-blue-500/20">
                                    <FiExternalLink className="mr-1" /> NASA - Black Holes
                                </a>
                                <a href="#" className="flex items-center text-blue-400 hover:text-blue-300 transition bg-blue-500/10 px-2 py-1 rounded hover:bg-blue-500/20">
                                    <FiExternalLink className="mr-1" /> Stellar Evolution - NASA
                                </a>
                            </div>
                        </div>

                        {/* Input Field */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ask anything about astronomy..."
                                className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-5 pr-12 text-gray-300 text-sm focus:outline-none focus:border-purple-500/50 transition backdrop-blur-sm focus:bg-black/60"
                            />
                            <button className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-purple-600/80 hover:bg-purple-600 p-2 rounded-full transition hover:scale-110">
                                <FiSend className="text-white text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Standard LLM Stat */}
                        <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300 hover:border-red-500/40">
                            <h4 className="text-gray-400 text-xs mb-1">Standard LLM</h4>
                            <div className="text-2xl md:text-3xl font-bold text-red-500 mb-1">15-20%</div>
                            <div className="text-red-400/80 text-xs">Error Rate</div>
                        </div>
                        {/* Astra-Bot RAG Stat */}
                        <div className="bg-green-950/20 border border-green-500/20 rounded-2xl p-4 hover:scale-105 transition-transform duration-300 hover:border-green-500/40">
                            <h4 className="text-gray-400 text-xs mb-1">Astra-Bot RAG</h4>
                            <div className="text-2xl md:text-3xl font-bold text-green-500 mb-1">&lt;2%</div>
                            <div className="text-green-400/80 text-xs">Error Rate</div>
                        </div>
                    </div>
                </div>


                {/* RIGHT COLUMN: How RAG Works Flowchart */}
                <div className="bg-gray-900/20 backdrop-blur-l border border-white/10 rounded-3xl p-5 md:p-6 h-full shadow-lg flex flex-col justify-center hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-shadow duration-300">
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">How RAG Works</h2>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-md">
                            Retrieval-Augmented Generation ensures every answer is grounded in verified NASA data, eliminating the risk of AI hallucination.
                        </p>
                    </div>

                    {/* Steps Container */}
                    <div className="flex flex-col space-y-4">

                        {/* Step 1 */}
                        <div className="flex items-start bg-white/5 border border-white/5 p-3 rounded-2xl relative overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:translate-x-2 hover:border-blue-500/30">
                            {/* Connecting Line hidden on last item */}
                            <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-blue-500/30 to-transparent h-full -z-10 lg:block hidden"></div>

                            <div className="bg-blue-600/10 p-2 rounded-xl mr-3 shrink-0">
                                <FaUser className="text-blue-400 text-lg" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-0.5 text-white"><span className="text-blue-400">Step 1</span> User Question</h4>
                                <p className="text-gray-400 text-xs">You ask about astronomy</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start bg-white/5 border border-white/5 p-3 rounded-2xl relative overflow-hidden backdrop-blur-sm z-10 hover:bg-white/10 transition-all duration-300 hover:translate-x-2 hover:border-purple-500/30 delay-100">
                            {/* Connecting Line */}
                            <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-purple-500/30 to-transparent h-full -z-10 lg:block hidden"></div>

                            <div className="bg-purple-600/10 p-2 rounded-xl mr-3 shrink-0">
                                <FaDatabase className="text-purple-400 text-lg" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-0.5 text-white"><span className="text-purple-400">Step 2</span> NASA Search</h4>
                                <p className="text-gray-400 text-xs">System searches verified NASA database</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start bg-white/5 border border-white/5 p-3 rounded-2xl relative overflow-hidden backdrop-blur-sm z-10 hover:bg-white/10 transition-all duration-300 hover:translate-x-2 hover:border-teal-500/30 delay-200">
                            {/* Connecting Line */}
                            <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-teal-500/30 to-transparent h-full -z-10 lg:block hidden"></div>

                            <div className="bg-teal-600/10 p-2 rounded-xl mr-3 shrink-0">
                                <FiLayers className="text-teal-400 text-lg" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-0.5 text-white"><span className="text-teal-400">Step 3</span> Retrieve Facts</h4>
                                <p className="text-gray-400 text-xs">Top 5-10 relevant chunks extracted</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start bg-white/5 border border-white/5 p-3 rounded-2xl z-10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:translate-x-2 hover:border-green-500/30 delay-300">
                            <div className="bg-green-600/10 p-2 rounded-xl mr-3 shrink-0">
                                <FaRobot className="text-green-400 text-lg" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-0.5 text-white"><span className="text-green-400">Step 4</span> Generate Answer</h4>
                                <p className="text-gray-400 text-xs">AI responds ONLY from retrieved facts</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default RagExplanationSection;