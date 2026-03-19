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
        <section className="relative min-h-screen py-24 bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black font-outfit overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">📰 Cosmic News Hub</h2>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Your gateway to the latest cosmic discoveries, rocket launches, and space weather events — curated from NASA and leading astronomy sources worldwide.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsData.map(item => (
                        <article
                            key={item.id}
                            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] flex flex-col group"
                        >
                            <div
                                className="h-48 w-full relative overflow-hidden cursor-pointer"
                                onClick={() => setSelectedArticle(item)}
                            >
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 flex items-center shadow-lg">
                                    {categories.find(c => c.id === item.category)?.icon} <span className="ml-2 capitalize">{item.category}</span>
                                </div>
                            </div>

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
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transform hover:-translate-y-0.5"
                                        onClick={() => setSelectedArticle(item)}
                                    >
                                        Read Article
                                    </button>
                                    <button
                                        className={`p-2 rounded-full transition-all duration-300 ${isBookmarked(item.id) ? 'bg-purple-600/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                        onClick={() => toggleBookmark(item.id)}
                                        title={isBookmarked(item.id) ? 'Remove bookmark' : 'Bookmark article'}
                                    >
                                        {isBookmarked(item.id) ? '🔖' : '📑'}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
                    <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                        <button
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-md"
                            onClick={() => setSelectedArticle(null)}
                        >
                            ✕
                        </button>

                        <div className="relative h-64 sm:h-80 w-full">
                            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                                <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 inline-flex items-center mb-4">
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
                                    className={`flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${isBookmarked(selectedArticle.id) ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
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
                                    Read on Source
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
