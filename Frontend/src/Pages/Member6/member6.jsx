import React, { useState, useEffect, useRef, useCallback } from 'react';
import './member6.css';

// Backend API base URL
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
        { id: 'all', name: 'All News', icon: 'ðŸŒŒ' },
        { id: 'missions', name: 'Missions', icon: 'ðŸš€' },
        { id: 'discoveries', name: 'Discoveries', icon: 'ðŸ”­' },
        { id: 'spaceweather', name: 'Space Weather', icon: 'â˜€ï¸' },
        { id: 'technology', name: 'Technology', icon: 'ðŸ›°ï¸' },
        { id: 'planets', name: 'Planets', icon: 'ðŸª' }
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

    // â”€â”€â”€ Fetch APOD from backend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // â”€â”€â”€ Fetch news from backend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const fetchNews = async (page = 1, append = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '6',
                category: activeCategory,
                sort: sortBy,
                search: searchTerm,
            });
            const response = await fetch(`${API_BASE}/news?${params}`);
            if (!response.ok) throw new Error('News fetch failed');
            const data = await response.json();

            const articles = data.articles.map(a => ({
                id: a.id,
                title: a.title,
                summary: a.summary,
                fullContent: a.fullContent,
                source: a.source,
                date: a.date,
                category: a.category,
                image: a.image,
                url: a.url,
                readingTime: a.readingTime,
                trending: a.trending,
            }));

            if (append) {
                setNewsData(prev => [...prev, ...articles]);
            } else {
                setNewsData(articles);
            }
            setHasMoreFromServer(data.hasMore);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    // â”€â”€â”€ Fetch gallery from backend â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const fetchGallery = async (query = 'space') => {
        setGalleryLoading(true);
        try {
            const params = new URLSearchParams({
                q: query || 'space',
                page: '1',
            });
            const response = await fetch(`${API_BASE}/media?${params}`);
            if (!response.ok) throw new Error('Media fetch failed');
            const data = await response.json();

            const items = data.items.map(item => ({
                id: item.id,
                type: item.type,
                title: item.title,
                thumbnail: item.thumbnail,
                videoUrl: item.videoUrl,
            }));
            setGalleryItems(items);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setGalleryLoading(false);
        }
    };

    // â”€â”€â”€ Initial load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // Infinite scroll â€” load next page from server
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

    // Fallback APOD while loading
    const displayApod = apod || {
        title: "Loading...",
        date: getTodayDate(),
        url: "#",
        img: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1600&h=900&fit=crop",
        explanation: "Fetching today's astronomy picture...",
        photographer: "NASA"
    };

    return (
        <div className="member6-container">
            {/* Header with Search */}
            <header className="media-header">
                <h1>ðŸŒŒ Cosmic Library</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search news, images, topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn" onClick={() => handleSearch(searchTerm)}>ðŸ”</button>
                </div>
            </header>

            {/* Hero Section: APOD */}
            <section className="apod-section" style={{ backgroundImage: `url(${displayApod.img})` }}>
                <div className="apod-overlay"></div>
                <div className="apod-content">
                    <div className="apod-header-info">
                        <span className="badge">ðŸŒŸ Astronomy Picture of the Day</span>
                        <span className="apod-date">{displayApod.date}</span>
                    </div>
                    <h2>{displayApod.title}</h2>
                    <p>{displayApod.explanation}</p>
                    <div className="apod-footer">
                        <span className="apod-credit">ðŸ“· {displayApod.photographer}</span>
                        <a href={displayApod.url} target="_blank" rel="noopener noreferrer" className="apod-link">
                            View Full Resolution â†’
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
                    ðŸ“° News Feed
                </button>
                <button
                    className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    ðŸ–¼ Media Gallery
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
                                        onClick={() => setActiveCategory(cat.id)}
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
                                <h3>ðŸ”¥ Trending Now</h3>
                                <div className="trending-grid">
                                    {newsData.filter(item => item.trending).slice(0, 3).map(item => (
                                        <div
                                            key={item.id}
                                            className="trending-card"
                                            onClick={() => setSelectedArticle(item)}
                                        >
                                            <div className="trending-image" style={{ backgroundImage: `url(${item.image})` }}>
                                                <span className="trending-badge">ðŸ”¥ Trending</span>
                                            </div>
                                            <div className="trending-content">
                                                <h4>{item.title}</h4>
                                                <div className="trending-meta">
                                                    <span>{item.source}</span>
                                                    <span>â€¢</span>
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
                                                    style={{ backgroundImage: `url(${item.image})` }}
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
                                                            <span className="meta-dot">â€¢</span>
                                                            <span className="news-time">{formatRelativeTime(item.date)}</span>
                                                            <span className="meta-dot">â€¢</span>
                                                            <span className="reading-time">â± {item.readingTime} min read</span>
                                                        </div>

                                                        <div className="meta-actions">
                                                            <button
                                                                className={`bookmark-btn ${isBookmarked(item.id) ? 'bookmarked' : ''}`}
                                                                onClick={() => toggleBookmark(item.id)}
                                                                title={isBookmarked(item.id) ? 'Remove bookmark' : 'Bookmark article'}
                                                            >
                                                                {isBookmarked(item.id) ? 'ðŸ”–' : 'ðŸ“‘'}
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
                                                                ðŸ”—
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
                                            <span className="end-icon">âœ¨</span>
                                            <p>You've reached the end of cosmic news</p>
                                            <p className="end-subtitle">Check back later for more updates!</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-icon">ðŸ”­</span>
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
                                    onClick={() => item.type === 'video' && setSelectedVideo(item)}
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="media-thumbnail"
                                        loading="lazy"
                                    />
                                    {item.type === 'video' && (
                                        <div className="video-overlay">
                                            <div className="play-button">â–¶ï¸</div>
                                        </div>
                                    )}
                                    <div className="media-info">
                                        <h4>{item.title}</h4>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <span className="empty-icon">ðŸŽ¬</span>
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
                            âœ•
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
                                    <span>â€¢</span>
                                    <span>{new Date(selectedArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <span>â€¢</span>
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
                                    {isBookmarked(selectedArticle.id) ? 'ðŸ”– Bookmarked' : 'ðŸ“‘ Bookmark'}
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
                                    ðŸ”— Share
                                </button>
                                <a
                                    href={selectedArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-btn primary"
                                >
                                    Read on NASA â†’
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
                            âœ•
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
