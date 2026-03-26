import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaTrophy, FaMedal, FaChartLine } from "react-icons/fa";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { HiLightBulb } from "react-icons/hi";
import { BsStars } from "react-icons/bs";
import AuthContext from '../../context/AuthContext';

const backendUrl = process.env.VITE_API_URL;

const API_BASE = backendUrl;

const DailyQuizSection = () => {
    // --- AUTH & NAVIGATION ---
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    // State for Quiz (Main branch Feature)
    const [questionData, setQuestionData] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for User Stats (Friend's Feature)
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // 1. Fetch User Stats (From Friend's Branch logic)
        const loadStats = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const res = await fetch(`${API_BASE}/gamification/dashboard/${userId}`);
                    const data = await res.json();
                    if (data.success) {
                        setUserData(data.user);
                    }
                } catch (e) {
                    console.error('Failed to load user stats:', e);
                }
            }
        };

        // 2. Fetch Random Quiz (From Main Branch logic)
        const fetchRandomQuiz = async () => {
            try {
                const response = await fetch(`${API_BASE}/quiz/random`);
                if (response.ok) {
                    const data = await response.json();
                    const options = [data.option1, data.option2, data.option3, data.option4].filter(Boolean);
                    setQuestionData({ ...data, options });
                }
            } catch (error) {
                console.error("Failed to fetch random quiz", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
        fetchRandomQuiz();
    }, [user]);

    // --- HANDLERS ---
    const handleOptionSelect = (option) => {
        if (selectedAnswer) return; // Prevent changing answer
        setSelectedAnswer(option);
        setIsCorrect(option === questionData.correctAnswer);
    };

    // Derived values for the UI
    const streakCount = userData?.currentStreak || 0;
    const totalScore = userData?.totalScore || 0;

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
                        <div className="text-sm font-bold text-white">{streakCount} Days</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">

                {/* LEFT COLUMN: Main Quiz Card */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 md:p-6 shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-shadow duration-300">

                        {/* Quiz Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-white mb-0.5">Today's Quiz</h2>
                                <p className="text-gray-400 text-xs">Question 1 of 1</p>
                            </div>
                            <div className="mt-3 md:mt-0 bg-orange-900/20 border border-orange-700/30 text-orange-400 px-3 py-1 rounded-full text-xs font-medium flex items-center animate-pulse">
                                <FaFire className="mr-1.5" /> {streakCount} day streak
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex space-x-1.5 mb-6">
                            <div className="h-1 flex-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            <div className="h-1 flex-1 bg-gray-700/50 rounded-full"></div>
                            <div className="h-1 flex-1 bg-gray-700/50 rounded-full"></div>
                        </div>

                        {/* Question & Options */}
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 bg-gray-800 rounded w-3/4 mb-6"></div>
                                {[1, 2, 3, 4].map(n => <div key={n} className="h-12 bg-gray-800 rounded"></div>)}
                            </div>
                        ) : questionData ? (
                            <>
                                <h3 className="text-base md:text-lg text-gray-200 font-medium mb-6 leading-relaxed">
                                    {questionData.question}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {questionData.options.map((option, index) => {
                                        let optionStyle = "border-gray-700/50 bg-gray-800/20 text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 hover:border-purple-500/30";
                                        let icon = null;

                                        if (selectedAnswer) {
                                            if (option === questionData.correctAnswer) {
                                                optionStyle = "border-green-500/30 bg-green-900/10 text-white shadow-[0_0_15px_rgba(34,197,94,0.05)]";
                                                icon = <IoMdCheckmarkCircle className="text-green-500 text-lg" />;
                                            } else if (option === selectedAnswer) {
                                                optionStyle = "border-red-500/30 bg-red-900/10 text-white shadow-[0_0_15px_rgba(239,68,68,0.05)]";
                                                icon = <IoMdCloseCircle className="text-red-500 text-lg" />;
                                            } else {
                                                optionStyle = "border-gray-800/50 bg-gray-900/20 text-gray-500 cursor-not-allowed opacity-50";
                                            }
                                        }

                                        return (
                                            <div
                                                key={index}
                                                onClick={() => handleOptionSelect(option)}
                                                className={`relative p-3 rounded-xl border flex justify-between items-center transition-all duration-200 cursor-pointer text-sm hover:scale-[1.01] ${optionStyle}`}
                                            >
                                                <span className="font-medium">{option}</span>
                                                {icon}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Post-Answer Result */}
                                {selectedAnswer && (
                                    <div className="animate-fade-in-up mt-6 space-y-4">
                                        <div className={`bg-${isCorrect ? 'green' : 'red'}-900/10 border border-${isCorrect ? 'green' : 'red'}-800/20 rounded-xl p-4 flex items-start`}>
                                            <div className={`bg-${isCorrect ? 'green' : 'red'}-500/10 p-1.5 rounded-lg mr-3 shrink-0`}>
                                                <HiLightBulb className={`text-${isCorrect ? 'green' : 'red'}-400 text-base animate-pulse`} />
                                            </div>
                                            <div>
                                                <h4 className={`text-${isCorrect ? 'green' : 'red'}-400 text-xs font-bold mb-0.5`}>
                                                    {isCorrect ? "Correct! Did you know?" : "Not quite! Did you know?"}
                                                </h4>
                                                <p className="text-gray-400 text-xs leading-relaxed">
                                                    The correct answer is {questionData.correctAnswer}. Keep exploring the universe to learn more!
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/quiz')}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-purple-900/20 transform hover:scale-[1.02]"
                                        >
                                            Try more quizzes 🚀
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <h3 className="text-base md:text-lg text-red-400 font-medium mb-6 leading-relaxed">
                                Failed to load today's quiz. Please try again later.
                            </h3>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Stats & Progress */}
                <div className="flex flex-col gap-4 md:gap-6">
                    {/* Current Streak Card */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="text-gray-400 text-xs mb-0.5">Current Streak</h4>
                                <div className="text-2xl font-bold text-orange-500 animate-pulse">{streakCount} days</div>
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
                                <span className="text-gray-400 text-xs">Total Points Earned</span>
                                <span className="text-purple-400 font-bold text-sm">{totalScore.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Small Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 hover:bg-gray-800/60 transition-colors">
                            <div className="text-2xl font-bold text-white mb-0.5">{userData?.badgesEarned || 0}</div>
                            <div className="text-[10px] text-gray-400">Badges Earned</div>
                        </div>
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 hover:bg-gray-800/60 transition-colors">
                            <div className="text-2xl font-bold text-white mb-0.5">#{userData?.globalRank || '---'}</div>
                            <div className="text-[10px] text-gray-400">Global Rank</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DailyQuizSection;