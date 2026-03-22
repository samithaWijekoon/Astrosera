import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { FiClock } from 'react-icons/fi';
import { FiMapPin } from 'react-icons/fi';
import { FiNavigation } from 'react-icons/fi';
import { FiEye } from 'react-icons/fi';
import { FiBell } from 'react-icons/fi';
import { FiMail } from 'react-icons/fi';
import { FiCheckCircle } from 'react-icons/fi';
import { IoRocketOutline } from 'react-icons/io5';
import { IoPlanetOutline } from 'react-icons/io5';
import { BiRadar } from 'react-icons/bi';
import { BsToggleOn } from 'react-icons/bs';
import { BsToggleOff } from 'react-icons/bs';
import { WiSolarEclipse } from 'react-icons/wi';

const EventsSection = () => {
    // State for toggles in the Smart Reminders card
    const [reminders, setReminders] = useState({
        oneHour: true,
        fifteenMinutes: true,
        dailyDigest: false,
    });
    const [userEmail, setUserEmail] = useState('');
    const [isEmailSaved, setIsEmailSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Dynamic backend URL
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const handleSaveEmail = () => {
        if (!userEmail || !userEmail.includes('@')) return;
        setIsSaving(true);
        // Simulate a tiny delay for UX
        setTimeout(() => {
            setIsEmailSaved(true);
            setIsSaving(false);
        }, 500);
    };

    const sendReminderEmail = async (eventName, reminderType, scheduledTime = '') => {
        if (!userEmail || !isEmailSaved) {
            alert('Please enter and save your email address in the Smart Reminders widget first.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/alerts/event-reminder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    eventName,
                    reminderType,
                    scheduledTime
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert(`Reminder set! An email confirmation has been sent to ${userEmail}`);
            } else {
                alert(`Failed to set reminder: ${data.error}`);
            }
        } catch (error) {
            console.error('Error dispatching reminder:', error);
            alert('Something went wrong connecting to the notification server.');
        }
    };

    const toggleReminder = (key, label) => {
        const isTurningOn = !reminders[key];
        setReminders(prev => ({ ...prev, [key]: isTurningOn }));
        
        // If they are turning it on, dispatch an email confirmation immediately
        if (isTurningOn && isEmailSaved) {
            sendReminderEmail('All Subscribed Events', label);
        } else if (isTurningOn && !isEmailSaved) {
            alert('Please add your email to receive this reminder.');
            setReminders(prev => ({ ...prev, [key]: false }));
        }
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
             fetchpriority="high" preload="auto">
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
                            <div className="flex items-center"><FiCalendar className="mr-2 text-gray-500" /> Nov 24, 2026</div>
                            <div className="flex items-center"><FiClock className="mr-2 text-gray-500" /> 6:30 PM EST</div>
                            <div className="flex items-center"><FiNavigation className="mr-2 text-gray-500" /> Southeast</div>
                            <div className="flex items-center"><span className="text-gray-500 mr-2">Elevation:</span> 45°</div>
                        </div>

                        <div className="flex space-x-3">
                            <button onClick={() => sendReminderEmail('SpaceX Starship Flight 7', 'Specific Event', 'Nov 24, 2026 at 6:30 PM EST')} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full text-xs font-medium transition cursor-pointer hover:shadow-lg hover:shadow-orange-600/30">Set Reminder</button>
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
                            <div className="flex items-center"><FiCalendar className="mr-2 text-gray-500" /> Dec 13-14, 2026</div>
                            <div className="flex items-center whitespace-nowrap"><FiClock className="mr-2 text-gray-500" /> 11:00 PM - 4:00 AM</div>
                            <div className="flex items-center"><FiNavigation className="mr-2 text-gray-500" /> Northeast</div>
                            <div className="flex items-center"><span className="text-gray-500 mr-2">Elevation:</span> 70°</div>
                        </div>

                        <div className="flex space-x-3">
                            <button onClick={() => sendReminderEmail('Geminids Meteor Shower Peak', 'Specific Event', 'Dec 13-14, 2026 at 11:00 PM')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-medium transition cursor-pointer hover:shadow-lg hover:shadow-blue-600/30">Set Reminder</button>
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
                            <button onClick={() => sendReminderEmail('ISS Pass Overhead', 'Specific Event', 'Today at 8:45 PM EST')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-xs font-medium transition cursor-pointer hover:shadow-lg hover:shadow-purple-600/30">Set Reminder</button>
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

                        {/* Email Input Placeholder section */}
                        <div className="mb-6 pb-6 border-b border-gray-800">
                            <label className="text-xs text-gray-400 mb-2 block">Alert Email Address</label>
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input 
                                        type="email" 
                                        value={userEmail}
                                        onChange={(e) => {
                                            setUserEmail(e.target.value);
                                            setIsEmailSaved(false);
                                        }}
                                        placeholder="astronaut@astrosera.com"
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                                    />
                                </div>
                                <button 
                                    onClick={handleSaveEmail}
                                    disabled={!userEmail || !userEmail.includes('@') || isSaving || isEmailSaved}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center min-w-[80px] ${
                                        isEmailSaved 
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-800 disabled:text-gray-500'
                                    }`}
                                >
                                    {isSaving ? '...' : isEmailSaved ? <FiCheckCircle /> : 'Save'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">1 hour before</span>
                                <button onClick={() => toggleReminder('oneHour', '1 Hour Before')} className="text-xl focus:outline-none cursor-pointer">
                                    {reminders.oneHour ? <BsToggleOn className="text-blue-500" /> : <BsToggleOff className="text-gray-600" />}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">15 minutes before</span>
                                <button onClick={() => toggleReminder('fifteenMinutes', '15 Minutes Before')} className="text-xl focus:outline-none cursor-pointer">
                                    {reminders.fifteenMinutes ? <BsToggleOn className="text-blue-500" /> : <BsToggleOff className="text-gray-600" />}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs">Daily digest</span>
                                <button onClick={() => toggleReminder('dailyDigest', 'Daily Digest')} className="text-xl focus:outline-none cursor-pointer">
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