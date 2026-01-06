import React from 'react';
import { FiShield, FiDatabase, FiAward } from "react-icons/fi";

const StatsSection = () => {
    const stats = [
        {
            icon: <FiShield className="text-2xl text-blue-400" />,
            bgColor: "bg-blue-600/20",
            value: "<2%",
            valueColor: "text-blue-400",
            label: "Error Rate",
            description: "RAG technology reduces errors from 15-20% to under 2%."
        },
        {
            icon: <FiDatabase className="text-2xl text-indigo-400" />,
            bgColor: "bg-indigo-600/20",
            value: "10,000+",
            valueColor: "text-indigo-400",
            label: "NASA Docs",
            description: "Every answer sourced from verified NASA databases."
        },
        {
            icon: <FiAward className="text-2xl text-purple-400" />, // Closest match to the ribbon/award icon
            bgColor: "bg-purple-600/20",
            value: "100%",
            valueColor: "text-purple-400",
            label: "Citations",
            description: "Automatic source links to original NASA data."
        }
    ];

    return (
        <section
            className="relative w-full py-20 bg-[#0a0a0a] flex items-center justify-center font-sans overflow-hidden"
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

            {/* Dark Overlay for better text readability against the starry background */}
            <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                {/* Header Section */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything You Need to Explore the Cosmos
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                        Powered by NASA-verified data with RAG technology for <br className="hidden md:block" /> unmatched accuracy
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`bg-gray-900/40 border border-gray-800 rounded-3xl p-6 text-center transition duration-300 flex flex-col items-center hover:-translate-y-2 group
                                ${index === 0 ? 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30' : ''}
                                ${index === 1 ? 'hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30' : ''}
                                ${index === 2 ? 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30' : ''}
                            `}
                        >
                            {/* Icon Container */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${stat.bgColor} group-hover:scale-110 transition duration-300`}>
                                {stat.icon}
                            </div>

                            {/* Stat Value */}
                            <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.valueColor}`}>
                                {stat.value}
                            </div>

                            {/* Label */}
                            <h3 className="text-lg text-white font-semibold mb-3">
                                {stat.label}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default StatsSection;