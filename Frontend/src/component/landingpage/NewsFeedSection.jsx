import React, { useState } from 'react';
import '../../Pages/Member6/member6.css';

const NewsFeedSection = () => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

    // Hardcoded news data as requested (MAP THE DATA)
    const newsData = [
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

    const categories = [
        { id: 'all', name: 'All News', icon: '🌌' },
        { id: 'missions', name: 'Missions', icon: '🚀' },
        { id: 'discoveries', name: 'Discoveries', icon: '🔭' },
        { id: 'spaceweather', name: 'Space Weather', icon: '☀️' },
    ];

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

    const toggleBookmark = (articleId) => {
        if (bookmarkedArticles.includes(articleId)) {
            setBookmarkedArticles(bookmarkedArticles.filter(id => id !== articleId));
        } else {
            setBookmarkedArticles([...bookmarkedArticles, articleId]);
        }
    };

    const isBookmarked = (articleId) => {
        return bookmarkedArticles.includes(articleId);
    };

    return (
        <section className="member6-container" style={{ minHeight: 'auto', paddingTop: '40px' }}>
            {/* News Feed Controls Removed for cleaner Integration */}
            
            <div className="content-area">
                <div className="trending-section pb-0">
                    <h3>📰 Galactic News Feed</h3>
                    <p className="text-gray-400 mb-8 max-w-2xl text-sm leading-relaxed text-left">
                        Stay updated on the latest cosmic discoveries, rocket launches, and space weather events directly from NASA and other major astronomy sources.
                    </p>
                </div>
                
                <div className="news-feed" style={{ paddingTop: 0 }}>
                    <div className="news-grid">
                        {newsData.map(item => (
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
                                    <span className="news-category">
                                        {categories.find(c => c.id === item.category)?.icon} {item.category}
                                    </span>

                                    <h3
                                        className="news-title"
                                        onClick={() => setSelectedArticle(item)}
                                    >
                                        {item.title}
                                    </h3>

                                    <p className="news-summary">{item.summary}</p>

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
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="article-modal" onClick={() => setSelectedArticle(null)} style={{ zIndex: 1000 }}>
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
                                <a
                                    href={selectedArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="action-btn primary"
                                >
                                    Read on Source →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default NewsFeedSection;
