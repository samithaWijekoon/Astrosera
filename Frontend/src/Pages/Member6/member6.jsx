import React, { useState, useEffect, useRef, useCallback } from 'react';
import './member6.css';
import { API_BASE_URL } from '../../config/apiConfig';

const API_BASE = API_BASE_URL;

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
        <div className="relative min-h-screen py-24 bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black font-outfit overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with Search */}
            <header className="mb-12">
                <div className="flex justify-center">
                    <div className="flex items-center w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-[0_0_30px_rgba(168,85,247,0.1)] focus-within:border-purple-500/50 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
                        <span className="text-xl mr-3">🔭</span>
                        <input
                            type="text"
                            placeholder="Explore the cosmos — search news, galaxies, missions..."
                            className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchTerm); }}
                        />
                        <button 
                            className="ml-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                            onClick={() => handleSearch(searchTerm)}
                        >
                            <span className="text-sm">✦</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section: APOD */}
            <section className="mb-16">
                {apodLoading ? (
                    <div className="w-full h-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl animate-pulse"></div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col md:flex-row group hover:border-purple-500/30 transition-all duration-500">
                        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                            <img src={displayApod.img} alt={displayApod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-purple-600/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg">
                                🌟 Astronomy Picture of the Day
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{displayApod.title}</h2>
                            </div>
                            <span className="text-purple-400 text-sm font-medium mb-4">{displayApod.date}</span>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-4">{displayApod.explanation}</p>
                            <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-6">
                                <span className="text-gray-500 text-xs">📷 {displayApod.photographer}</span>
                                <a 
                                    href={displayApod.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-purple-400 hover:text-pink-400 text-sm font-bold uppercase tracking-wider flex items-center transition-colors"
                                >
                                    View Full Resolution <span className="ml-2">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Tabs */}
            <div className="flex justify-center space-x-8 mb-12 border-b border-white/10 pb-4">
                <button
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'news' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    onClick={() => setActiveTab('news')}
                >
                    📰 News Feed
                </button>
                <button
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'gallery' ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    🖼 Media Gallery
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full">
                {activeTab === 'news' && (
                    <>
                        {/* Filters and Sorting */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6" ref={newsGridRef}>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 flex items-center space-x-2 
                                        ${activeCategory === cat.id 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md">
                                <label className="text-gray-400 text-xs font-medium">Sort by:</label>
                                <select 
                                    className="bg-transparent text-white text-xs outline-none cursor-pointer"
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="date" className="bg-black text-white">Latest First</option>
                                    <option value="relevance" className="bg-black text-white">Most Relevant</option>
                                </select>
                            </div>
                        </div>

                        {searchTerm && (
                            <div className="text-center mb-8 text-gray-400 text-sm">
                                Showing results for "<span className="text-purple-400 font-bold">{searchTerm}</span>"
                            </div>
                        )}

                        {/* Trending Section */}
                        {activeCategory === 'all' && !searchTerm && (
                            <div className="mb-16">
                                <h3 className="text-2xl font-bold text-white tracking-tight mb-8">🔥 Trending Now</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {newsData.filter(item => item.trending).slice(0, 3).map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] cursor-pointer group flex flex-col"
                                            onClick={() => setSelectedArticle(item)}
                                        >
                                            <div className="h-40 relative overflow-hidden">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
                                                    🔥 Trending
                                                </div>
                                            </div>
                                            <div className="p-5 flex-grow flex flex-col">
                                                <h4 className="text-white font-bold mb-3 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">{item.title}</h4>
                                                <div className="text-xs text-purple-400/80 mt-auto flex space-x-2">
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
                        <div className="w-full">
                            {displayedNews.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {displayedNews.map(item => (
                                            <article 
                                                key={item.id} 
                                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] flex flex-col group"
                                            >
                                                {/* Article Image */}
                                                <div
                                                    className="h-48 w-full relative overflow-hidden cursor-pointer"
                                                    onClick={() => setSelectedArticle(item)}
                                                >
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 flex items-center shadow-lg">
                                                        {categories.find(c => c.id === item.category)?.icon} <span className="ml-2 capitalize">{item.category}</span>
                                                    </div>
                                                </div>

                                                {/* Article Content */}
                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-purple-400 text-xs font-medium">{item.source} • {formatRelativeTime(item.date)}</span>
                                                        <span className="text-purple-400/80 text-xs">⏱ {item.readingTime} min</span>
                                                    </div>

                                                    <h3 
                                                        className="text-xl font-bold text-white tracking-tight mb-3 line-clamp-2 cursor-pointer hover:text-purple-400 transition-colors"
                                                        onClick={() => setSelectedArticle(item)}
                                                    >
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                                        {item.summary}
                                                    </p>

                                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                                                        <button 
                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transform hover:-translate-y-0.5 cursor-pointer"
                                                            onClick={() => setSelectedArticle(item)}
                                                        >
                                                            Read Article
                                                        </button>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${isBookmarked(item.id) ? 'bg-purple-600/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                                                onClick={() => toggleBookmark(item.id)}
                                                                title={isBookmarked(item.id) ? 'Remove bookmark' : 'Bookmark article'}
                                                            >
                                                                {isBookmarked(item.id) ? '🔖' : '📑'}
                                                            </button>
                                                            <button
                                                                className="p-2 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                        {galleryLoading ? (
                            <div className="col-span-full flex flex-col items-center justify-center p-12">
                                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-400 font-medium">Loading cosmic media...</p>
                            </div>
                        ) : filteredGallery.length > 0 ? (
                            filteredGallery.map(item => (
                                <div
                                    key={item.id}
                                    className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden relative group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-500/30 ${item.type === 'video' ? 'cursor-pointer' : ''}`}
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
                                    <div className="aspect-[4/3] w-full overflow-hidden">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-purple-600/60 transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                                <span className="text-2xl ml-1">▶️</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 w-full p-5">
                                        <h4 className="text-white font-bold text-lg drop-shadow-md line-clamp-2">{item.title}</h4>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl">
                                <span className="text-5xl mb-4 opacity-50">🎬</span>
                                <h3 className="text-xl font-bold text-white mb-2">No media found</h3>
                                <p className="text-gray-400">Try adjusting your cosmic search parameters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
                    <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                        <button
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-md cursor-pointer"
                            onClick={() => setSelectedArticle(null)}
                        >
                            ✕
                        </button>

                        <div className="relative h-64 sm:h-80 w-full">
                            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                                <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 inline-flex items-center mb-4 shadow-lg">
                                    {categories.find(c => c.id === selectedArticle.category)?.icon} <span className="ml-2 capitalize">{selectedArticle.category}</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">{selectedArticle.title}</h2>
                                <div className="text-purple-400 text-sm font-medium">
                                    {selectedArticle.source} • {new Date(selectedArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ⏱ {selectedArticle.readingTime} min read
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="prose prose-invert prose-purple max-w-none mb-8 text-gray-300 leading-relaxed">
                                <p>{selectedArticle.fullContent}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 border-t border-white/10 pt-6">
                                <button
                                    className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 border cursor-pointer ${isBookmarked(selectedArticle.id) ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                    onClick={() => toggleBookmark(selectedArticle.id)}
                                >
                                    <span className="mr-2 text-xl">{isBookmarked(selectedArticle.id) ? '🔖' : '📑'}</span>
                                    {isBookmarked(selectedArticle.id) ? 'Bookmarked' : 'Bookmark Article'}
                                </button>
                                <a
                                    href={selectedArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] flex-grow text-center"
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}></div>
                    <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-4xl shadow-[0_0_50px_rgba(168,85,247,0.2)] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white tracking-tight">{selectedVideo.title}</h3>
                            <button
                                className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                onClick={() => setSelectedVideo(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="w-full bg-black rounded-2xl overflow-hidden aspect-video">
                            <video
                                className="w-full h-full object-contain"
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