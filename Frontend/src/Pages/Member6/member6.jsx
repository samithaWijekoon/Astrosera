import React, { useState, useEffect, useRef, useCallback } from 'react';
import './member6.css';

const API_BASE = 'http://localhost:8001/api';

const Member6 = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("news");
    const [visibleNews, setVisibleNews] = useState(6);
    const [loading, setLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [apod, setApod] = useState(null);
    const [newsPage, setNewsPage] = useState(1);
    const [hasMoreFromServer, setHasMoreFromServer] = useState(true);
    const observerTarget = useRef(null);
    const newsGridRef = useRef(null);

    const handleSearch = (value) => {
        if (value && newsGridRef.current) {
            setTimeout(() => {
                newsGridRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    // Categories
    const categories = [
        { id: 'all', name: 'All News', icon: '🌌' },
        { id: 'missions', name: 'Missions', icon: '🚀' },
        { id: 'discoveries', name: 'Discoveries', icon: '🔭' },
        { id: 'spaceweather', name: 'Space Weather', icon: '☀️' },
        { id: 'technology', name: 'Technology', icon: '🛰️' },
        { id: 'planets', name: 'Planets', icon: '🪐' }
    ];

    // Dynamic date function
    const getTodayDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    // Format date to relative time
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // ─── Fetch APOD from backend ───────────────────────────────────
    const fetchAPOD = async () => {
        try {
            const response = await fetch(`${API_BASE}/apod`);
            if (!response.ok) throw new Error('APOD fetch failed');
            const data = await response.json();
            setApod({
                title: data.title,
                date: data.date,
                url: data.hdurl || data.url,
                img: data.url,
                explanation: data.explanation,
                photographer: data.copyright || 'NASA'
            });
        } catch (error) {
            console.error('Error fetching APOD:', error);
            // Fallback APOD
            setApod({
                title: "Spiral Galaxy NGC 4565",
                date: getTodayDate(),
                url: "https://images.nasa.gov/details/PIA25656",
                img: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1600&h=900&fit=crop",
                explanation: "This stunning spiral galaxy, viewed edge-on, showcases billions of stars swirling in cosmic dance.",
                photographer: "NASA/ESA/Hubble"
            });
        }
    };

    // ─── Fetch news from backend (MOCKED) ──────────────────────────
    const fetchNews = async (page = 1, append = false) => {
        setLoading(true);
        setTimeout(() => {
            const articles = [
                {
                    id: 'n1',
                    title: 'NASA Discovers Potentially Habitable Exoplanet',
                    summary: 'The James Webb Space Telescope has detected water vapor signatures on a newly found super-Earth located 45 light-years away.',
                    fullContent: 'Astronomers using NASA’s James Webb Space Telescope have discovered compelling evidence for water vapor in the atmosphere of an exoplanet roughly 2.5 times the size of Earth. Designated as Kepler-452c, this exoplanet orbits in the habitable zone of its host star. This marks a significant milestone in our search for habitable worlds beyond our solar system, offering tantalizing clues about planetary evolution.',
                    source: 'NASA/JPL',
                    date: new Date().toISOString(),
                    category: 'discoveries',
                    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop',
                    url: 'https://www.nasa.gov',
                    readingTime: 4,
                    trending: true,
                },
                {
                    id: 'n2',
                    title: 'SpaceX Starship Completes Historic Orbital Flight',
                    summary: 'The massive Starship rocket successfully reached orbit and safely re-entered Earth’s atmosphere, splashing down in the Indian Ocean.',
                    fullContent: 'SpaceX has hit another monumental milestone with its giant Starship rocket, successfully completing a full orbital test flight. The spacecraft, designed to carry humans to Mars, performed nominally through staging and reached its target trajectory. After re-entering the atmosphere, it executed a soft splashdown. This brings humanity one step closer to becoming a multi-planetary species.',
                    source: 'SpaceX',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    category: 'missions',
                    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&h=400&fit=crop',
                    url: 'https://www.spacex.com',
                    readingTime: 3,
                    trending: true,
                },
                {
                    id: 'n3',
                    title: 'Major Solar Flare Could Cause Auroras Tonight',
                    summary: 'An X-class solar flare erupted from sunspot AR3354, throwing a significant CME towards Earth that will cause intense auroras.',
                    fullContent: 'Space weather forecasters have issued a geometric storm watch following a powerful X-class solar flare. A coronal mass ejection (CME) associated with the flare is expected to impact Earth’s magnetic field late tonight. Skywatchers at mid-to-high latitudes may be treated to stunning auroral displays as incoming solar particles excite gases in the upper atmosphere.',
                    source: 'NOAA Space Weather',
                    date: new Date(Date.now() - 172800000).toISOString(),
                    category: 'spaceweather',
                    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=400&fit=crop',
                    url: 'https://www.spaceweather.gov',
                    readingTime: 2,
                    trending: false,
                }
            ];

            let filtered = articles;
            if (activeCategory !== 'all') {
                filtered = filtered.filter(a => a.category === activeCategory);
            }
            if (searchTerm) {
                filtered = filtered.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
            }

            if (append) {
                setNewsData(prev => [...prev, ...filtered]);
            } else {
                setNewsData(filtered);
            }
            setHasMoreFromServer(false);
            setLoading(false);
        }, 500);
    };

    // ─── Fetch gallery from backend (MOCKED) ───────────────────────
    const fetchGallery = async (query = 'space') => {
        setGalleryLoading(true);
        setTimeout(() => {
            const items = [
                {
                    id: 'g1', type: 'image', title: 'Carina Nebula',
                    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&h=500&fit=crop',
                    nasaId: ''
                },
                {
                    id: 'g2', type: 'image', title: 'Milky Way Core',
                    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=500&fit=crop',
                    nasaId: ''
                },
                {
                    id: 'g3', type: 'image', title: 'Jupiter Great Red Spot',
                    thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&h=500&fit=crop',
                    nasaId: ''
                }
            ];
            
            let filtered = items;
            if (query && query !== 'space') {
                filtered = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()));
            }
            
            setGalleryItems(filtered);
            setGalleryLoading(false);
        }, 500);
    };

    // ─── Initial load ──────────────────────────────────────────────
    useEffect(() => {
        fetchAPOD();
        fetchGallery();

        // Load bookmarks from localStorage
        const savedBookmarks = localStorage.getItem('bookmarkedArticles');
        if (savedBookmarks) {
            setBookmarkedArticles(JSON.parse(savedBookmarks));
        }
    }, []);

    // Fetch news when filters change
    useEffect(() => {
        setNewsPage(1);
        fetchNews(1, false);
    }, [activeCategory, sortBy, searchTerm]);

    // Filter gallery when search changes and gallery tab is active
    useEffect(() => {
        if (activeTab === 'gallery') {
            fetchGallery(searchTerm || 'space');
        }
    }, [searchTerm, activeTab]);

    const displayedNews = newsData;
    const hasMoreNews = hasMoreFromServer;

    // Filter gallery items locally by search
    const filteredGallery = galleryItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Bookmark functions
    const toggleBookmark = (articleId) => {
        let newBookmarks;
        if (bookmarkedArticles.includes(articleId)) {
            newBookmarks = bookmarkedArticles.filter(id => id !== articleId);
        } else {
            newBookmarks = [...bookmarkedArticles, articleId];
        }
        setBookmarkedArticles(newBookmarks);
        localStorage.setItem('bookmarkedArticles', JSON.stringify(newBookmarks));
    };

    const isBookmarked = (articleId) => {
        return bookmarkedArticles.includes(articleId);
    };

    // Infinite scroll — load next page from server
    const loadMoreNews = useCallback(() => {
        if (loading || !hasMoreFromServer) return;

        const nextPage = newsPage + 1;
        setNewsPage(nextPage);
        fetchNews(nextPage, true);
    }, [loading, hasMoreFromServer, newsPage]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMoreFromServer && !loading) {
                    loadMoreNews();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMoreFromServer, loading, loadMoreNews]);

    const apodLoading = !apod;
    const displayApod = apod || {
        title: "",
        date: "",
        url: "#",
        img: "",
        explanation: "",
        photographer: ""
    };

    return (
        <div className="member6-container">
            {/* Header with Search */}
            <header className="media-header">
                <div className="search-bar">
                    <span className="search-icon-left">🔭</span>
                    <input
                        type="text"
                        placeholder="Explore the cosmos — search news, galaxies, missions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchTerm); }}
                    />
                    <button className="search-btn" onClick={() => handleSearch(searchTerm)}>
                        <span className="search-btn-icon">✦</span>
                    </button>
                </div>
            </header>

            {/* Hero Section: APOD */}
            <section className="apod-section">
                {apodLoading ? (
                    <div className="apod-loading-skeleton">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-line skeleton-title"></div>
                            <div className="skeleton-line skeleton-text"></div>
                            <div className="skeleton-line skeleton-text short"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="apod-image-wrapper">
                            <img src={displayApod.img} alt={displayApod.title} className="apod-image" />
                            <div className="apod-image-overlay">
                                <span className="badge">🌟 Astronomy Picture of the Day</span>
                            </div>
                        </div>
                        <div className="apod-content">
                            <div className="apod-header-info">
                                <h2>{displayApod.title}</h2>
                                <span className="apod-date">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                            </div>
                            <p>{displayApod.explanation}</p>
                            <div className="apod-footer">
                                <span className="apod-credit">📷 {displayApod.photographer}</span>
                                <a href={displayApod.url} target="_blank" rel="noopener noreferrer" className="apod-link">
                                    View Full Resolution →
                                </a>
                            </div>
                        </div>
                    </>
                )}
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

            {/* Content Area */}
            <div className="content-area">
                {activeTab === 'news' && (
                    <>
                        {/* Filters and Sorting */}
                        <div className="news-controls" ref={newsGridRef}>
                            <div className="category-filters">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setSearchInput('');
                                            setSearchTerm('');
                                        }}
                                    >
                                        <span className="cat-icon">{cat.icon}</span>
                                        <span className="cat-name">{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="sort-controls">
                                <label>Sort by:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="date">Latest First</option>
                                    <option value="relevance">Most Relevant</option>
                                </select>
                            </div>
                        </div>

                        {searchTerm && (
                            <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#888',
                                fontSize: '0.95rem'
                            }}>
                                Showing results for "<strong style={{ color: '#8b5cf6' }}>{searchTerm}</strong>"
                            </div>
                        )}

                        {/* Trending Section */}
                        {activeCategory === 'all' && !searchTerm && (
                            <div className="trending-section">
                                <h3>🔥 Trending Now</h3>
                                <div className="trending-grid">
                                    {newsData.filter(item => item.trending).slice(0, 3).map(item => (
                                        <div
                                            key={item.id}
                                            className="trending-card"
                                            onClick={() => setSelectedArticle(item)}
                                        >
                                            <div className="trending-image" style={{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop'})` }}>
                                                <span className="trending-badge">🔥 Trending</span>
                                            </div>
                                            <div className="trending-content">
                                                <h4>{item.title}</h4>
                                                <div className="trending-meta">
                                                    <span>{item.source}</span>
                                                    <span>•</span>
                                                    <span>{formatRelativeTime(item.date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* News Feed */}
                        <div className="news-feed">
                            {displayedNews.length > 0 ? (
                                <>
                                    <div className="news-grid">
                                        {displayedNews.map(item => (
                                            <article key={item.id} className="news-card-pro">
                                                {/* Article Image */}
                                                <div
                                                    className="news-image"
                                                    style={{ backgroundImage: `url(${item.image || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop'})` }}
                                                    onClick={() => setSelectedArticle(item)}
                                                >
                                                    <div className="news-image-overlay">
                                                        <button className="read-article-btn">Read Article</button>
                                                    </div>
                                                </div>

                                                {/* Article Content */}
                                                <div className="news-content">
                                                    {/* Category Badge */}
                                                    <span className="news-category">
                                                        {categories.find(c => c.id === item.category)?.icon} {item.category}
                                                    </span>

                                                    {/* Title */}
                                                    <h3
                                                        className="news-title"
                                                        onClick={() => setSelectedArticle(item)}
                                                    >
                                                        {item.title}
                                                    </h3>

                                                    {/* Summary */}
                                                    <p className="news-summary">{item.summary}</p>

                                                    {/* Meta Info */}
                                                    <div className="news-meta">
                                                        <div className="meta-left">
                                                            <span className="news-source">{item.source}</span>
                                                            <span className="meta-dot">•</span>
                                                            <span className="news-time">{formatRelativeTime(item.date)}</span>
                                                            <span className="meta-dot">•</span>
                                                            <span className="reading-time">⏱ {item.readingTime} min read</span>
                                                        </div>

                                                        <div className="meta-actions">
                                                            <button
                                                                className={`bookmark-btn ${isBookmarked(item.id) ? 'bookmarked' : ''}`}
                                                                onClick={() => toggleBookmark(item.id)}
                                                                title={isBookmarked(item.id) ? 'Remove bookmark' : 'Bookmark article'}
                                                            >
                                                                {isBookmarked(item.id) ? '🔖' : '📑'}
                                                            </button>
                                                            <button
                                                                className="share-btn"
                                                                onClick={() => {
                                                                    if (navigator.share) {
                                                                        navigator.share({
                                                                            title: item.title,
                                                                            text: item.summary,
                                                                            url: window.location.href
                                                                        });
                                                                    }
                                                                }}
                                                                title="Share article"
                                                            >
                                                                🔗
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    {/* Loading Indicator */}
                                    {loading && (
                                        <div className="loading-indicator">
                                            <div className="spinner"></div>
                                            <p>Loading more cosmic news...</p>
                                        </div>
                                    )}

                                    {/* Intersection Observer Target */}
                                    <div ref={observerTarget} style={{ height: '20px' }}></div>

                                    {/* End of feed message */}
                                    {!hasMoreNews && displayedNews.length > 6 && (
                                        <div className="end-of-feed">
                                            <span className="end-icon">✨</span>
                                            <p>You've reached the end of cosmic news</p>
                                            <p className="end-subtitle">Check back later for more updates!</p>
                                        </div>
                                    )}
                                </>
                            ) : loading ? (
                                <div className="loading-indicator" style={{ gridColumn: '1 / -1', marginTop: '40px' }}>
                                    <div className="spinner"></div>
                                    <p>Searching the cosmos...</p>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">🔭</span>
                                    <h3>No cosmic news found</h3>
                                    <p>Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'gallery' && (
                    <div className="media-grid">
                        {galleryLoading ? (
                            <div className="loading-indicator" style={{ gridColumn: '1 / -1' }}>
                                <div className="spinner"></div>
                                <p>Loading cosmic media...</p>
                            </div>
                        ) : filteredGallery.length > 0 ? (
                            filteredGallery.map(item => (
                                <div
                                    key={item.id}
                                    className={`media-item ${item.type === 'video' ? 'clickable' : ''}`}
                                    onClick={async () => {
                                        if (item.type === 'video' && item.nasaId) {
                                            try {
                                                const resp = await fetch(`${API_BASE}/media/video/${item.nasaId}`);
                                                const data = await resp.json();
                                                setSelectedVideo({ ...item, videoUrl: data.videoUrl });
                                            } catch {
                                                setSelectedVideo(item);
                                            }
                                        }
                                    }}
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="media-thumbnail"
                                        loading="lazy"
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
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <span className="empty-icon">🎬</span>
                                <h3>No media found</h3>
                                <p>Try adjusting your search</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="article-modal" onClick={() => setSelectedArticle(null)}>
                    <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="close-modal"
                            onClick={() => setSelectedArticle(null)}
                        >
                            ✕
                        </button>

                        <div className="article-header">
                            <img src={selectedArticle.image} alt={selectedArticle.title} />
                            <div className="article-header-overlay">
                                <span className="article-category">
                                    {categories.find(c => c.id === selectedArticle.category)?.icon} {selectedArticle.category}
                                </span>
                                <h2>{selectedArticle.title}</h2>
                                <div className="article-meta-info">
                                    <span>{selectedArticle.source}</span>
                                    <span>•</span>
                                    <span>{new Date(selectedArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{selectedArticle.readingTime} min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="article-body">
                            <p className="article-full-content">{selectedArticle.fullContent}</p>

                            <div className="article-actions">
                                <button
                                    className="action-btn"
                                    onClick={() => toggleBookmark(selectedArticle.id)}
                                >
                                    {isBookmarked(selectedArticle.id) ? '🔖 Bookmarked' : '📑 Bookmark'}
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: selectedArticle.title,
                                                text: selectedArticle.summary,
                                                url: window.location.href
                                            });
                                        }
                                    }}
                                >
                                    🔗 Share
                                </button>
                                <a
                                    href={selectedArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-btn primary"
                                >
                                    Read on NASA →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            <video
                                width="100%"
                                height="450"
                                controls
                                autoPlay
                                src={selectedVideo.videoUrl}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Member6;