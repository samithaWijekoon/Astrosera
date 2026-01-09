import React, { useState, useEffect  } from 'react';
import './member6.css';

// Member 06: Space News Feed & Media Library
const Member6 = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("news"); // 'news' or 'gallery'
    const [visibleNews, setVisibleNews] = useState(3); // For infinite scroll
    const [loading, setLoading] = useState(false);
    
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
        },
        {
            id: 4,
            title: "Mars Rover Discovers Ancient Water Signs",
            summary: "Perseverance rover finds compelling evidence of ancient water on Mars.",
            source: "NASA JPL",
            date: "2024-03-12"
        },
        {
            id: 5,
            title: "New Exoplanet Could Harbor Life",
            summary: "Astronomers discover a potentially habitable exoplanet in the Goldilocks zone.",
            source: "Science Daily",
            date: "2024-03-10"
        },
        {
            id: 6,
            title: "ISS Celebrates 25 Years in Orbit",
            summary: "The International Space Station marks a quarter century of continuous human presence in space.",
            source: "NASA Blogs",
            date: "2024-03-08"
        },
        {
            id: 7,
            title: "China's Moon Base Plans Revealed",
            summary: "China announces ambitious timeline for lunar research station construction.",
            source: "SpaceNews",
            date: "2024-03-05"
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

    // Filter news based on search term
    const filteredNews = newsFeed.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter gallery items based on search term
    const filteredGallery = galleryItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Load more news (infinite scroll)
    const loadMoreNews = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleNews(prev => Math.min(prev + 3, filteredNews.length));
            setLoading(false);
        }, 500);
    };

    // Reset visible news when search changes
    useEffect(() => {
        setVisibleNews(3);
    }, [searchTerm]);

    // Get currently visible news
    const displayedNews = filteredNews.slice(0, visibleNews);
    const hasMoreNews = visibleNews < filteredNews.length;
    
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
                {displayedNews.length > 0 ? (
                    <>
                        {displayedNews.map(item => (
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
                        
                        {/* Load More Button */}
                        {hasMoreNews && (
                            <div className="load-more-container">
                                <button 
                                    className="load-more-btn" 
                                    onClick={loadMoreNews}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Load More Cosmic News 🚀'}
                                </button>
                            </div>
                        )}

                        {/* End of feed message */}
                        {!hasMoreNews && displayedNews.length > 3 && (
                            <div className="end-of-feed">
                                ✨ You've reached the end of cosmic news
                            </div>
                        )}
                    </>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                        No news found matching "{searchTerm}"
                    </p>
                )}
            </div>
        )}
            {activeTab === 'gallery' && (
                <div className="media-grid">
                    {filteredGallery.length > 0 ? (
                        filteredGallery.map(item => (
                            <div key={item.id} className="media-item">
                                <div className="media-placeholder">
                                    {item.type === 'video' ? '▶️' : '📷'}
                                </div>
                                <div className="media-info">
                                    <h4>{item.title}</h4>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666', padding: '40px', gridColumn: '1 / -1' }}>
                            No gallery items found matching "{searchTerm}"
                        </p>
                    )}
                </div>
            )}
        </div>
    </div>
);
};

export default Member6;