import React, { useState, useEffect } from 'react';
import './member2.css';

// Member 02: Astronomy Event Localization Module
const Member2 = () => {
    const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, name: "New York, USA" });
    const [events, setEvents] = useState([
        { id: 1, name: "Solar Eclipse", date: "2024-04-08", type: "Eclipse", visible: true },
        { id: 2, name: "Perseid Meteor Shower", date: "2024-08-12", type: "Meteor", visible: true },
        { id: 3, name: "SpaceX Starship Launch", date: "2024-05-15", type: "Launch", visible: false }
    ]);
    const [timeLeft, setTimeLeft] = useState("");

    // Countdown Timer Logic (Simulated for upcoming event)
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const target = new Date("2024-04-08T14:00:00"); // Example dynamic target
            const diff = target - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("Event Started!");
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLocationChange = (e) => {
        // Placeholder for real map/location picker logic
        setLocation({ ...location, name: e.target.value });
    };

    return (
        <div className="member2-container">
            <header className="events-header">
                <h1>Cosmic Events Tracker</h1>
                <div className="location-picker">
                    <span>📍 Viewing from: </span>
                    <input
                        type="text"
                        value={location.name}
                        onChange={handleLocationChange}
                        placeholder="Enter City or Coords"
                    />
                    <button className="locate-btn">Use GPS</button>
                </div>
            </header>

            <section className="featured-countdown">
                <h2>Next Major Event: Solar Eclipse</h2>
                <div className="timer-display">{timeLeft}</div>
            </section>

            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className={`event-card ${event.visible ? 'visible' : 'not-visible'}`}>
                        <div className="event-date">{event.date}</div>
                        <h3>{event.name}</h3>
                        <span className="event-type">{event.type}</span>
                        <div className={`visibility-tag ${event.visible ? 'yes' : 'no'}`}>
                            {event.visible ? "👁 Visible Tonight" : "🚫 Not Visible"}
                        </div>
                        <button className="reminder-btn">🔔 Set Reminder</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Member2;
