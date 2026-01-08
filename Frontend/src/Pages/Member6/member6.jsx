import React, { useState } from 'react';
import './member6.css';

// Member 06: Space News Feed & Media Library
const Member6 = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("news"); // 'news' or 'gallery'

    const apod = {
        title: "The Pillars of Creation",
        url: "https://images.nasa.gov/details/PIA25656", // Placeholder link
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/800px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg", // Wiki common public domain
        explanation: "New processing of Hubble data showing the famous Pillars of Creation in the Eagle Nebula."
    };

    const newsFeed = [
        {
            id: 1,
            title: "NASA's Artemis II Crew Announced",
            summary: "NASA announced the four astronauts who will venture around the Moon on Artemis II.",
            source: "NASA Blogs",
            date: "2024-03-20"
        },
        {
            id: 2,
            title: "James Webb Telescope Spots Earliest Galaxies",
            summary: "Webb reveals galaxies similar to our Milky Way in the young universe.",
            source: "Science Daily",
            date: "2024-03-18"
        },
        {
            id: 3,
            title: "SpaceX Starship prepares for Flight 4",
            summary: "Updates on the next test flight of the massive Starship rocket.",
            source: "SpaceNews",
            date: "2024-03-15"
        }
    ];

    const galleryItems = [
        { id: 1, type: 'image', title: 'Spiral Galaxy', src: '#' },
        { id: 2, type: 'video', title: 'Black Hole Simulation', src: '#' },
        { id: 3, type: 'image', title: 'Nebula Colors', src: '#' },
        { id: 4, type: 'image', title: 'Mars Rover Selfie', src: '#' },
        { id: 5, type: 'image', title: 'Earth from ISS', src: '#' },
        { id: 6, type: 'video', title: 'Solar Flare', src: '#' },
    ];

    return (
        <div className="member6-container">
            <header className="media-header">
                <h1>Cosmic Library</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search news, images, topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn">🔍</button>
                </div>
            </header>

            {/* Hero Section: APOD */}
            <section className="apod-section" style={{ backgroundImage: `url(${apod.img})` }}>
                <div className="apod-content">
                    <span className="badge">Astronomy Picture of the Day</span>
                    <h2>{apod.title}</h2>
                    <p>{apod.explanation}</p>
                </div>
            </section>

            {/* Tabs */}
            <div className="content-tabs">
                <button
                    className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
                    onClick={() => setActiveTab('news')}
                >
                    📰 News Feed
                </button>
                <button
                    className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    🖼 Media Gallery
                </button>
            </div>

            <div className="content-area">
                {activeTab === 'news' && (
                    <div className="news-feed">
                        {newsFeed.map(item => (
                            <div key={item.id} className="news-card">
                                <div className="news-meta">
                                    <span className="news-source">{item.source}</span>
                                    <span className="news-date">{item.date}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.summary}</p>
                                <button className="read-more">Read Full Story →</button>
                            </div>
                        ))}
                        <div className="loading-trigger">Loading more cosmic news...</div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="media-grid">
                        {galleryItems.map(item => (
                            <div key={item.id} className="media-item">
                                <div className="media-placeholder">{item.type === 'video' ? '▶️' : '📷'}</div>
                                <div className="media-info">
                                    <h4>{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Member6;
