import React from 'react';
import { FaFire, FaTrophy, FaMedal, FaChartLine } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { HiLightBulb } from "react-icons/hi";
import { BsStars } from "react-icons/bs";

const DailyQuizSection = () => {
    return (
        <section
            className="relative min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8 lg:p-12 font-sans overflow-hidden"
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
            {/* Top Right Floating Notification */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 animate-fade-in-down z-20 hidden md:flex">
                <div className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-3 flex items-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1.5 rounded-lg mr-2">
                        <BsStars className="text-white text-sm" />
                    </div>
                    <div>
                        <div className="text-[10px] text-purple-200">Daily Streak</div>
                        <div className="text-sm font-bold text-white">15 Days</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">

                {/* LEFT COLUMN: Main Quiz Card (Spans 2 columns on large screens) */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 md:p-6 shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-shadow duration-300">

                        {/* Quiz Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-white mb-0.5">Today's Quiz</h2>
                                <p className="text-gray-400 text-xs">Question 1 of 3</p>
                            </div>
                            <div className="mt-3 md:mt-0 bg-orange-900/20 border border-orange-700/30 text-orange-400 px-3 py-1 rounded-full text-xs font-medium flex items-center animate-pulse">
                                <FaFire className="mr-1.5" /> 15 day streak
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex space-x-1.5 mb-6">
                            <div className="h-1 flex-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            <div className="h-1 flex-1 bg-gray-700/50 rounded-full"></div>
                            <div className="h-1 flex-1 bg-gray-700/50 rounded-full"></div>
                        </div>

                        {/* Question */}
                        <h3 className="text-base md:text-lg text-gray-200 font-medium mb-6 leading-relaxed">
                            What is the approximate temperature at the core of the Sun?
                        </h3>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {/* Option 1 */}
                            <div className="group p-3 rounded-xl border border-gray-700/50 bg-gray-800/20 hover:bg-gray-800/40 transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-200 text-sm hover:scale-[1.01] hover:border-purple-500/30">
                                5,500°C (surface temperature)
                            </div>

                            {/* Option 2 (Correct/Selected) */}
                            <div className="relative p-3 rounded-xl border border-green-500/30 bg-green-900/10 text-white flex justify-between items-center shadow-[0_0_15px_rgba(34,197,94,0.05)] cursor-pointer text-sm transform scale-[1.01]">
                                <span className="font-medium">15 million°C</span>
                                <IoMdCheckmarkCircle className="text-green-500 text-lg" />
                            </div>

                            {/* Option 3 */}
                            <div className="p-3 rounded-xl border border-gray-700/50 bg-gray-800/20 hover:bg-gray-800/40 transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-200 text-sm hover:scale-[1.01] hover:border-purple-500/30">
                                1 million°C
                            </div>

                            {/* Option 4 */}
                            <div className="p-3 rounded-xl border border-gray-700/50 bg-gray-800/20 hover:bg-gray-800/40 transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-200 text-sm hover:scale-[1.01] hover:border-purple-500/30">
                                100,000°C
                            </div>
                        </div>

                        {/* Fact Box */}
                        <div className="bg-blue-900/10 border border-blue-800/20 rounded-xl p-4 flex items-start hover:bg-blue-900/20 transition-colors">
                            <div className="bg-blue-500/10 p-1.5 rounded-lg mr-3 shrink-0">
                                <HiLightBulb className="text-blue-400 text-base animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-blue-400 text-xs font-bold mb-0.5">Did you know?</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    The Sun's core reaches temperatures of about 15 million degrees Celsius, hot enough to sustain nuclear fusion reactions that power our solar system.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>


                {/* RIGHT COLUMN: Stats & Progress (Spans 1 column) */}
                <div className="flex flex-col gap-4 md:gap-6">

                    {/* Current Streak Card */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="text-gray-400 text-xs mb-0.5">Current Streak</h4>
                                <div className="text-2xl font-bold text-orange-500 animate-pulse">15 days</div>
                            </div>
                            <div className="bg-orange-500/10 p-2 rounded-lg">
                                <FaFire className="text-orange-500 text-lg" />
                            </div>
                        </div>

                        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                            <span>Next milestone</span>
                            <span>30 days (Silver)</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-1.5 mb-1">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full w-1/2"></div>
                        </div>
                    </div>

                    {/* Performance Card */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-2 mb-4">
                            <FaChartLine className="text-green-400 text-sm" />
                            <h3 className="text-white font-semibold text-sm">Performance</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-400">Accuracy Rate</span>
                                    <span className="text-green-400 font-bold">87%</span>
                                </div>
                                <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full w-[87%] shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                                <span className="text-gray-400 text-xs">Total Quizzes</span>
                                <span className="text-white font-bold text-sm">145</span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                                <span className="text-gray-400 text-xs">Points Earned</span>
                                <span className="text-purple-400 font-bold text-sm">2,340</span>
                            </div>
                        </div>
                    </div>

                    {/* Small Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 hover:bg-gray-800/60 transition-colors">
                            <div className="text-2xl font-bold text-white mb-0.5">7</div>
                            <div className="text-[10px] text-gray-400 flex items-center">
                                Badges Earned
                            </div>
                        </div>
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 hover:bg-gray-800/60 transition-colors">
                            <div className="text-2xl font-bold text-white mb-0.5">#42</div>
                            <div className="text-[10px] text-gray-400">Global Rank</div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};


export default DailyQuizSection;