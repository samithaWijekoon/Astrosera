import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiNavigation, FiEye, FiBell } from "react-icons/fi";
import { IoRocketOutline, IoPlanetOutline } from "react-icons/io5";
import { BiRadar } from "react-icons/bi";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { WiSolarEclipse } from "react-icons/wi";

const EventsSection = () => {
    // State for toggles in the Smart Reminders card
    const [reminders, setReminders] = useState({
        oneHour: true,
        fifteenMinutes: true,
        dailyDigest: false,
    });

    const toggleReminder = (key) => {
        setReminders(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <section
            className="relative min-h-screen w-full bg-[#0a0a0a] flex justify-center p-4 md:p-8 lg:p-12 font-sans overflow-hidden"
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
            {/* Main Content Grid */}
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* --- LEFT COLUMN: Event Cards (Spans 2 columns on large screens) --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Card 1: SpaceX Rocket Launch */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center">
                                <div className="bg-orange-500/20 p-2.5 rounded-xl mr-3 group-hover:bg-orange-500/30 transition">
                                    <IoRocketOutline className="text-orange-500 text-xl group-hover:scale-110 transition" />
                                </div>
                                <div>
                                    <h4 className="text-orange-400 text-xs font-medium uppercase tracking-wide">Rocket Launch</h4>
                                    <h3 className="text-white text-lg font-bold">SpaceX Starship Flight 7</h3>
                                </div>
                            </div>
                            <div className="bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center border border-green-500/20 animate-pulse">
                                <FiEye className="mr-1" /> Visible
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400 mb-5">
                            <div className="flex items-center"><FiCalendar className="mr-2 text-gray-500" /> Nov 24, 2024</div>
                            <div className="flex items-center"><FiClock className="mr-2 text-gray-500" /> 6:30 PM EST</div>
                            <div className="flex items-center"><FiNavigation className="mr-2 text-gray-500" /> Southeast</div>
                            <div className="flex items-center"><span className="text-gray-500 mr-2">Elevation:</span> 45°</div>
                        </div>

                        <div className="flex space-x-3">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full text-xs font-medium transition cursor-pointer hover:shadow-lg hover:shadow-orange-600/30">Set Reminder</button>
                            <button className="bg-transparent hover:bg-white/5 text-gray-300 px-5 py-2 rounded-full text-xs font-medium border border-gray-700 transition cursor-pointer">View Details</button>
                        </div>
                    </div>

                    {/* Card 2: Meteor Shower */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center">
                                {/* Using a placeholder colored div for the meteor icon based on image */}
                                <div className="bg-blue-500/20 p-2.5 rounded-xl mr-3 relative overflow-hidden group-hover:bg-blue-500/30 transition">
                                    <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full group-hover:rotate-45 transition"></div>
                                </div>
                                <div>
                                    <h4 className="text-blue-400 text-xs font-medium uppercase tracking-wide">Meteor Shower</h4>
                                    <h3 className="text-white text-lg font-bold">Geminids Peak</h3>
                                </div>
                            </div>
                            <div className="bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center border border-green-500/20 animate-pulse">
                                <FiEye className="mr-1" /> Visible
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-400 mb-5">
                            <div className="flex items-center"><FiCalendar className="mr-2 text-gray-500" /> Dec 13-14, 2024</div>
                            <div className="flex items-center whitespace-nowrap"><FiClock className="mr-2 text-gray-500" /> 11:00 PM - 4:00 AM</div>
                            <div className="flex items-center"><FiNavigation className="mr-2 text-gray-500" /> Northeast</div>
                            <div className="flex items-center"><span className="text-gray-500 mr-2">Elevation:</span> 70°</div>
                        </div>

                        <div className="flex space-x-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-medium transition cursor-pointer hover:shadow-lg hover:shadow-blue-600/30">Set Reminder</button>
                            <button className="bg-transparent hover:bg-white/5 text-gray-300 px-5 py-2 rounded-full text-xs font-medium border border-gray-700 transition cursor-pointer">View Details</button>
                        </div>
                    </div>

                    {/* Card 3: ISS Pass */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center">
                                <div className="bg-purple-500/20 p-2.5 rounded-xl mr-3 group-hover:bg-purple-500/30 transition">
                                    <BiRadar className="text-purple-500 text-xl group-hover:rotate-180 transition duration-700" />
                                </div>
                                <div>
                                    <h4 className="text-purple-400 text-xs font-medium uppercase tracking-wide">ISS Pass</h4>
                                    <h3 className="text-white text-lg font-bold">International Space Station</h3>
                                </div>
                            </div>
                            <div className="bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center border border-green-500/20 animate-pulse">
                                <FiEye className="mr-1" /> Visible
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400 mb-5">
                            <div className="flex items-center"><FiCalendar className="mr-2 text-gray-500" /> Today</div>
                            <div className="flex items-center"><FiClock className="mr-2 text-gray-500" /> 8:45 PM EST</div>
                            <div className="flex items-center"><FiNavigation className="mr-2 text-gray-500" /> West to East</div>
                            <div className="flex items-center"><span className="text-gray-500 mr-2">Elevation:</span> 82°</div>
                        </div>

                        <div className="flex space-x-3">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-xs font-medium transition cursor-pointer hover:shadow-lg hover:shadow-purple-600/30">Set Reminder</button>
                            <button className="bg-transparent hover:bg-white/5 text-gray-300 px-5 py-2 rounded-full text-xs font-medium border border-gray-700 transition cursor-pointer">View Details</button>
                        </div>
                    </div>

                </div>


                {/* --- RIGHT COLUMN: Sidebar Widgets --- */}
                <div className="space-y-8">

                    {/* Widget 1: Your Location */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:border-gray-700 transition">
                        <div className="flex items-center mb-5">
                            <div className="bg-green-500/20 p-2.5 rounded-xl mr-3">
                                <FiMapPin className="text-green-500 text-lg" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base">Your Location</h3>
                                <p className="text-gray-400 text-xs">New York, USA</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Timezone</span>
                                <span className="text-gray-300">EST (UTC-5)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Coordinates</span>
                                <span className="text-gray-300">40.7°N, 74.0°W</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Sky Visibility</span>
                                <span className="text-green-400 font-medium">Clear Tonight</span>
                            </div>
                        </div>
                    </div>

                    {/* Widget 2: Smart Reminders */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:border-gray-700 transition">
                        <div className="flex items-center mb-5">
                            <div className="bg-blue-500/20 p-2.5 rounded-xl mr-3">
                                <FiBell className="text-blue-500 text-lg" />
                            </div>
                            <h3 className="text-white font-bold text-base">Smart Reminders</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">1 hour before</span>
                                <button onClick={() => toggleReminder('oneHour')} className="text-xl focus:outline-none cursor-pointer">
                                    {reminders.oneHour ? <BsToggleOn className="text-blue-500" /> : <BsToggleOff className="text-gray-600" />}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">15 minutes before</span>
                                <button onClick={() => toggleReminder('fifteenMinutes')} className="text-xl focus:outline-none cursor-pointer">
                                    {reminders.fifteenMinutes ? <BsToggleOn className="text-blue-500" /> : <BsToggleOff className="text-gray-600" />}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">Daily digest</span>
                                <button onClick={() => toggleReminder('dailyDigest')} className="text-xl focus:outline-none cursor-pointer">
                                    {reminders.dailyDigest ? <BsToggleOn className="text-blue-500" /> : <BsToggleOff className="text-gray-600" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Widget 3: Event Types */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-5 hover:border-gray-700 transition">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-white font-bold text-base">Event Types</h3>
                            <button className="text-[10px] text-gray-500 hover:text-white transition">View All</button>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center text-gray-300 group-hover:text-white transition">
                                    <IoRocketOutline className="mr-3 text-orange-500" /> Rocket Launches
                                </div>
                                <span className="text-gray-500 group-hover:text-white transition">12</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center text-gray-300 group-hover:text-white transition">
                                    {/* Placeholder for meteor icon */}
                                    <div className="w-3.5 h-3.5 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full mr-3"></div>
                                    Meteor Showers
                                </div>
                                <span className="text-gray-500 group-hover:text-white transition">8</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center text-gray-300 group-hover:text-white transition">
                                    <WiSolarEclipse className="mr-3 text-yellow-500 text-base" /> Eclipses
                                </div>
                                <span className="text-gray-500 group-hover:text-white transition">2</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center text-gray-300 group-hover:text-white transition">
                                    <IoPlanetOutline className="mr-3 text-purple-400" /> Planetary Alignments
                                </div>
                                <span className="text-gray-500 group-hover:text-white transition">5</span>
                            </div>
                            <div className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center text-gray-300 group-hover:text-white transition">
                                    <BiRadar className="mr-3 text-blue-400" /> ISS Passes
                                </div>
                                <span className="text-gray-500 group-hover:text-white transition">45</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default EventsSection;