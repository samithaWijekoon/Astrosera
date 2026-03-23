import React, { useState } from 'react';
import { FiMapPin, FiNavigation } from 'react-icons/fi';

const LocationFeature = () => {
    const [locationData, setLocationData] = useState({
        city: 'Your City',
        timezone: 'Detecting...',
        coords: '—',
        sky: 'Clear Tonight'
    });
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [manualLocation, setManualLocation] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [detected, setDetected] = useState(false);

    const handleDetectLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                        const data = await res.json();
                        const city = data.city || data.locality || 'Detected City';
                        const country = data.countryName || data.countryCode || '';
                        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                        setLocationData({
                            city: `${city}${country ? ', ' + country : ''}`,
                            timezone: tz,
                            coords: `${Math.abs(latitude).toFixed(2)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(2)}°${longitude >= 0 ? 'E' : 'W'}`,
                            sky: 'Clear Tonight'
                        });
                        setDetected(true);
                    } catch {
                        alert('Could not reverse-geocode your location.');
                    }
                    setIsLocating(false);
                    setIsEditingLocation(false);
                },
                () => {
                    alert('Location access denied. Please use manual entry.');
                    setIsLocating(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            setIsLocating(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!manualLocation.trim()) return;
        setLocationData({
            city: manualLocation,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            coords: 'Variable',
            sky: 'Unknown'
        });
        setDetected(true);
        setIsEditingLocation(false);
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center font-sans">

            {/* --- Background Video --- */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-70"
             fetchpriority="high" preload="auto">
                <source src="/videos/back3.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

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

                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90 mb-12">
                    Intelligent timezone conversion and location-based filtering ensures you only see
                    events visible from where you are, with precise viewing instructions.
                </p>

                {/* --- Dynamic Location Card --- */}
                <div className="relative bg-gray-900/50 backdrop-blur-md border border-green-500/20 rounded-2xl p-5 w-full max-w-sm shadow-[0_0_30px_rgba(34,197,94,0.1)] overflow-hidden">
                    {isEditingLocation && (
                        <div className="absolute inset-0 z-20 bg-gray-900/95 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-center">
                            <h3 className="text-white font-bold mb-3 text-sm">Update Location</h3>
                            <button
                                onClick={handleDetectLocation}
                                disabled={isLocating}
                                className="w-full bg-blue-600/20 text-blue-400 border border-blue-500/30 py-2 rounded-lg text-xs font-bold mb-3 hover:bg-blue-600/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <FiNavigation /> {isLocating ? 'Detecting...' : 'Use Current Location'}
                            </button>
                            <div className="text-center text-gray-500 text-xs mb-3">OR</div>
                            <form onSubmit={handleManualSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={manualLocation}
                                    onChange={(e) => setManualLocation(e.target.value)}
                                    placeholder="Enter city..."
                                    className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
                                />
                                <button type="submit" disabled={!manualLocation.trim()} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer">Set</button>
                            </form>
                            <button onClick={() => setIsEditingLocation(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white transition cursor-pointer">✕</button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500/20 p-2.5 rounded-xl">
                                <FiMapPin className="text-green-500 text-lg" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-white font-bold text-base">Your Location</h3>
                                <p className="text-gray-400 text-xs">{locationData.city}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setIsEditingLocation(true); setManualLocation(''); }}
                            className="text-xs text-gray-500 hover:text-green-400 border border-gray-700 hover:border-green-500/30 bg-black/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
                        >
                            {detected ? 'Edit' : 'Set Location'}
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Timezone</span>
                            <span className="text-gray-300">{locationData.timezone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Coordinates</span>
                            <span className="text-gray-300">{locationData.coords}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Sky Visibility</span>
                            <span className="text-green-400 font-medium">{locationData.sky}</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};


export default LocationFeature;