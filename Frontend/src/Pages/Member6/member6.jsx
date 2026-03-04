import React, { useState, useEffect  } from 'react';
import './member6.css';

// Member 06: Space News Feed & Media Library
const Member6 = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("news"); // 'news' or 'gallery'
    const [visibleNews, setVisibleNews] = useState(3); // For infinite scroll
    const [loading, setLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    
    // Dynamic date function
    const getTodayDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const apod = {
        title: "The Pillars of Creation",
        date: getTodayDate(), // Now shows TODAY's date automatically
        url: "https://images.nasa.gov/details/PIA25656",
        img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&h=900&fit=crop",
        explanation: "The James Webb Space Telescope captured this stunning view of the iconic Pillars of Creation in the Eagle Nebula. These towering structures of interstellar gas and dust are approximately 6,500 light-years away in the constellation Serpens.",
        photographer: "NASA/ESA/CSA/STScI"
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
    { 
        id: 1, 
        type: 'image', 
        title: 'Spiral Galaxy',
        thumbnail: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=400&fit=crop'
    },
    { 
        id: 2, 
        type: 'video', 
        title: 'Black Hole Visualization',
        thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/t9YLtDJZtPY'
    },
    { 
        id: 3, 
        type: 'image', 
        title: 'Nebula Colors',
        thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop'
    },
    { 
        id: 4, 
        type: 'image', 
        title: 'Mars Rover Discovery',
        thumbnail: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&h=400&fit=crop'
    },
    { 
        id: 5, 
        type: 'image', 
        title: 'Earth from Space',
        thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop'
    },
    { 
        id: 6, 
        type: 'video', 
        title: 'Solar System Journey',
        thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=400&fit=crop',
        videoUrl: 'https://www.youtube.com/embed/libKVRa01L8'
    }
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
                <div className="apod-overlay"></div>
                <div className="apod-content">
                    <div className="apod-header-info">
                        <span className="badge">🌟 Astronomy Picture of the Day</span>
                        <span className="apod-date">{apod.date}</span>
                    </div>
                    <h2>{apod.title}</h2>
                    <p>{apod.explanation}</p>
                    <div className="apod-footer">
                        <span className="apod-credit">📷 {apod.photographer}</span>
                        <a href={apod.url} target="_blank" rel="noopener noreferrer" className="apod-link">
                            View Full Resolution →
                        </a>
                    </div>
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
                            <div 
                                key={item.id} 
                                className={`media-item ${item.type === 'video' ? 'clickable' : ''}`}
                                onClick={() => item.type === 'video' && setSelectedVideo(item)}
                            >
                                <img 
                                    src={item.thumbnail} 
                                    alt={item.title}
                                    className="media-thumbnail"
                                />
                                {item.type === 'video' && (
                                    <div className="video-overlay">
                                        <div className="play-button">▶️</div>
                                    </div>
                                )}
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

    {/* Video Modal */}
    {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                <button 
                    className="close-modal" 
                    onClick={() => setSelectedVideo(null)}
                >
                    ✕
                </button>
                <h3>{selectedVideo.title}</h3>
                <div className="video-wrapper">
                    <iframe
                        width="100%"
                        height="450"
                        src={selectedVideo.videoUrl}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    )}
</div>
);
};

export default Member6;