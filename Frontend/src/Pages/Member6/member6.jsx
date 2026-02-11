import React, { useState, useEffect, useRef, useCallback } from 'react';
import './member6.css';


const Member6 = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("news");
    const [visibleNews, setVisibleNews] = useState(6);
    const [loading, setLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'relevance'
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const observerTarget = useRef(null);
    const newsGridRef = useRef(null);

     const handleSearch = (value) => {
        
        // Scroll to news grid when searching
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

    // Calculate reading time
    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200;
        const words = text.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
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

    // Fetch NASA APOD
    const fetchAPOD = async () => {
        try {
            const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            const data = await response.json();
            return {
                id: 'apod-' + Date.now(),
                title: data.title,
                summary: data.explanation.substring(0, 200) + '...',
                fullContent: data.explanation,
                source: 'NASA APOD',
                date: data.date,
                category: 'discoveries',
                image: data.url,
                url: data.hdurl || data.url,
                readingTime: calculateReadingTime(data.explanation),
                trending: true
            };
        } catch (error) {
            console.error('Error fetching APOD:', error);
            return null;
        }
    };

    // Mock news data with realistic content (this would be replaced with real API calls)
    const generateMockNews = () => {
        const mockArticles = [
            {
                id: 1,
                title: "NASA's Artemis II Crew Begins Training for Moon Mission",
                summary: "The four astronauts selected for Artemis II have begun intensive training for humanity's first crewed mission to lunar orbit in over 50 years.",
                fullContent: "NASA announced that the Artemis II crew has officially started their comprehensive training program at Johnson Space Center. The mission, scheduled for late 2025, will mark the first crewed voyage to the Moon since Apollo 17 in 1972. The crew includes Commander Reid Wiseman, Pilot Victor Glover, Mission Specialist Christina Koch, and Canadian Space Agency astronaut Jeremy Hansen. Their training encompasses spacecraft systems, emergency procedures, spacewalk preparation, and mission simulations. The 10-day mission will test all Orion spacecraft systems with crew aboard in the actual deep space environment of cislunar space.",
                source: "NASA Blogs",
                date: "2026-01-28",
                category: "missions",
                image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=400&fit=crop",
                url: "https://www.nasa.gov/artemis-ii",
                readingTime: 3,
                trending: true
            },
            {
                id: 2,
                title: "James Webb Telescope Discovers Ancient Galaxies",
                summary: "Webb reveals galaxies similar to our Milky Way in the young universe, challenging current theories of galaxy formation.",
                fullContent: "The James Webb Space Telescope has made a groundbreaking discovery of disk galaxies similar to our Milky Way but existing when the universe was only 3 billion years old. These findings challenge our understanding of how galaxies form and evolve. The observations show that these early galaxies already possessed organized rotating disks with spiral arms, suggesting that the process of galaxy formation occurred much faster than previously thought. This discovery could revolutionize our models of cosmic evolution and help explain how the universe transitioned from its primordial state to the structured cosmos we see today.",
                source: "Science Daily",
                date: "2026-01-27",
                category: "discoveries",
                image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&h=400&fit=crop",
                url: "https://www.nasa.gov/webb",
                readingTime: 4,
                trending: true
            },
            {
                id: 3,
                title: "SpaceX Starship Successfully Completes Orbital Test",
                summary: "The massive Starship rocket completed its first full orbital mission, marking a major milestone in space exploration.",
                fullContent: "SpaceX's Starship, the world's most powerful rocket, has successfully completed its first full orbital test flight. The 400-foot-tall vehicle launched from Starbase in Texas, achieved orbit, and successfully returned both the Super Heavy booster and Starship upper stage. This achievement represents a crucial step toward NASA's Artemis program and SpaceX's goal of making life multiplanetary. The successful test demonstrates the viability of fully reusable launch systems, which could dramatically reduce the cost of space access.",
                source: "SpaceNews",
                date: "2026-01-26",
                category: "missions",
                image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&h=400&fit=crop",
                url: "https://www.spacex.com/starship",
                readingTime: 3
            },
            {
                id: 4,
                title: "Mars Rover Discovers Organic Compounds in Ancient Lake Bed",
                summary: "Perseverance rover finds compelling evidence of ancient water and organic molecules on Mars.",
                fullContent: "NASA's Perseverance rover has discovered a treasure trove of organic compounds in rock samples from an ancient Martian lake bed in Jezero Crater. The findings include complex carbon-based molecules that could indicate past microbial life or provide insights into the organic chemistry of ancient Mars. Scientists are particularly excited about sedimentary rocks that show clear signs of having formed in water, strengthening the case that Mars once had conditions suitable for life. These samples are being carefully documented for potential return to Earth by future missions.",
                source: "NASA JPL",
                date: "2026-01-25",
                category: "discoveries",
                image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800&h=400&fit=crop",
                url: "https://mars.nasa.gov/mars2020",
                readingTime: 5,
                trending: true
            },
            {
                id: 5,
                title: "Potentially Habitable Exoplanet Found in Nearby Star System",
                summary: "Astronomers discover a rocky exoplanet in the habitable zone just 40 light-years away.",
                fullContent: "An international team of astronomers has discovered a potentially habitable exoplanet orbiting a red dwarf star just 40 light-years from Earth. The planet, designated as Proxima d, is roughly Earth-sized and orbits within the star's habitable zone where liquid water could exist on its surface. Early spectroscopic analysis suggests the presence of an atmosphere, making it one of the most promising candidates for hosting life beyond our solar system. Follow-up observations with the James Webb Space Telescope are already planned to search for biosignatures in the planet's atmosphere.",
                source: "Science Daily",
                date: "2026-01-24",
                category: "discoveries",
                image: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=800&h=400&fit=crop",
                url: "https://exoplanets.nasa.gov",
                readingTime: 4
            },
            {
                id: 6,
                title: "ISS Celebrates 25 Years of Continuous Human Presence",
                summary: "The International Space Station marks a quarter century of groundbreaking research and international cooperation.",
                fullContent: "The International Space Station (ISS) has reached a remarkable milestone: 25 years of continuous human habitation. Since November 2000, the orbiting laboratory has hosted astronauts from 20 countries and conducted over 3,000 scientific investigations. The ISS has been instrumental in advancing our understanding of human spaceflight, testing technologies for deep space exploration, and fostering international collaboration. As plans for commercial space stations develop, the ISS continues to serve as a vital platform for research and a symbol of what humanity can achieve through cooperation.",
                source: "NASA Blogs",
                date: "2026-01-23",
                category: "missions",
                image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
                url: "https://www.nasa.gov/station",
                readingTime: 4
            },
            {
                id: 7,
                title: "China Unveils Detailed Plans for Lunar Research Station",
                summary: "China announces ambitious timeline for International Lunar Research Station construction.",
                fullContent: "The China National Space Administration (CNSA) has released comprehensive plans for the International Lunar Research Station (ILRS), a permanent base on the Moon's south pole. The facility will be constructed in phases beginning in 2028, with initial robotic missions establishing basic infrastructure. The ILRS will support long-duration crew missions, in-situ resource utilization, and serve as a testbed for deep space exploration technologies. Several international partners have expressed interest in joining the project, which aims to maintain a permanent human presence on the Moon by the mid-2030s.",
                source: "SpaceNews",
                date: "2026-01-22",
                category: "missions",
                image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&h=400&fit=crop",
                url: "https://www.spacenews.com",
                readingTime: 5
            },
            {
                id: 8,
                title: "Hubble Observes Unexpected Dark Matter Distribution",
                summary: "New observations challenge our understanding of dark matter in galaxy clusters.",
                fullContent: "The Hubble Space Telescope has made puzzling observations that challenge current models of dark matter distribution in galaxy clusters. While dark matter is expected to follow predictable patterns based on gravitational interactions, Hubble's detailed mapping shows unexpected concentrations and voids that don't align with theoretical predictions. These findings could indicate unknown properties of dark matter or suggest the presence of previously undetected massive objects. The discovery has prompted calls for more observations with next-generation telescopes and may require revisions to our understanding of cosmic structure formation.",
                source: "NASA Blogs",
                date: "2026-01-21",
                category: "discoveries",
                image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop",
                url: "https://www.nasa.gov/hubble",
                readingTime: 4
            },
            {
                id: 9,
                title: "Private Companies Advance Commercial Space Station Plans",
                summary: "Multiple companies move forward with designs for commercial orbital platforms.",
                fullContent: "As the International Space Station approaches its planned retirement in 2030, several private companies are racing to develop commercial alternatives. Blue Origin's Orbital Reef, Axiom Space's station modules, and Northrop Grumman's design have all passed critical design reviews. These commercial stations will offer services including research facilities, manufacturing in microgravity, and space tourism. NASA has awarded contracts to support development, ensuring continued access to low Earth orbit for government and commercial customers. The transition represents a new era where space stations become commercial infrastructure rather than government-only facilities.",
                source: "SpaceNews",
                date: "2026-01-20",
                category: "technology",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
                url: "https://www.spacenews.com",
                readingTime: 5
            },
            {
                id: 10,
                title: "Powerful Solar Flare Causes Radio Blackouts on Earth",
                summary: "Scientists observe strongest solar activity in a decade with potential impacts on communications.",
                fullContent: "The Sun has unleashed its most powerful solar flare in over a decade, causing temporary radio blackouts across the Pacific Ocean region. The X-class flare, accompanied by a massive coronal mass ejection, highlights the Sun's increasing activity as it approaches solar maximum. While Earth's magnetic field protects us from most harmful radiation, such events can disrupt satellite communications, GPS systems, and power grids. Space weather forecasters are closely monitoring additional solar activity and have issued alerts for potential geomagnetic storms in the coming days. Auroras may be visible at lower latitudes than usual.",
                source: "NASA Space Weather",
                date: "2026-01-19",
                category: "spaceweather",
                image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=400&fit=crop",
                url: "https://spaceweather.gov",
                readingTime: 4
            },
            {
                id: 11,
                title: "Europa Clipper Enters Final Testing Phase",
                summary: "NASA's mission to explore Jupiter's icy moon passes critical milestone.",
                fullContent: "NASA's Europa Clipper spacecraft has entered its final testing phase at the Jet Propulsion Laboratory, marking a crucial step toward its 2024 launch. The mission will conduct detailed reconnaissance of Europa, an icy moon of Jupiter that may harbor a subsurface ocean with more than twice the water of Earth's oceans. The spacecraft carries nine science instruments designed to investigate Europa's ice shell thickness, surface composition, and potential plumes of water vapor. Scientists believe Europa is one of the most promising places in our solar system to search for current habitable conditions beyond Earth.",
                source: "NASA JPL",
                date: "2026-01-18",
                category: "missions",
                image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=400&fit=crop",
                url: "https://europa.nasa.gov",
                readingTime: 4
            },
            {
                id: 12,
                title: "AI-Powered System Dramatically Improves Asteroid Detection",
                summary: "New machine learning algorithms can identify near-Earth asteroids 100x faster.",
                fullContent: "A groundbreaking AI system developed by NASA and international partners can identify potentially hazardous asteroids 100 times faster than previous methods. The deep learning algorithm analyzes telescope data in real-time, distinguishing asteroids from background stars and cataloging their orbits with unprecedented accuracy. This technological leap could provide earlier warnings of potential Earth impacts and help scientists better understand the population of near-Earth objects. The system has already discovered several previously unknown asteroids and is being integrated into multiple observatory networks worldwide.",
                source: "Science Daily",
                date: "2026-01-17",
                category: "technology",
                image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&h=400&fit=crop",
                url: "https://cneos.jpl.nasa.gov",
                readingTime: 3
            }
        ];

        return mockArticles;
    };

    // Initialize news data
    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            const mockNews = generateMockNews();
            
            // Try to fetch real APOD
            const apod = await fetchAPOD();
            if (apod) {
                setNewsData([apod, ...mockNews]);
            } else {
                setNewsData(mockNews);
            }
            
            setLoading(false);
        };

        loadNews();

        // Load bookmarks from localStorage
        const savedBookmarks = localStorage.getItem('bookmarkedArticles');
        if (savedBookmarks) {
            setBookmarkedArticles(JSON.parse(savedBookmarks));
        }
    }, []);

    // APOD data
    const apod = {
        title: "Spiral Galaxy NGC 4565",
        date: getTodayDate(),
        url: "https://images.nasa.gov/details/PIA25656",
        img: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1600&h=900&fit=crop",
        explanation: "This stunning spiral galaxy, viewed edge-on, showcases billions of stars swirling in cosmic dance. Located approximately 40 million light-years away, its bright galactic core and sweeping spiral arms reveal the beautiful structure of our galactic neighbors.",
        photographer: "NASA/ESA/Hubble"
    };

    // Gallery items
    const galleryItems = [
        { 
            id: 1, 
            type: 'image', 
            title: 'Nebula Colors',
            thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop'
        },
        { 
            id: 2, 
            type: 'video', 
            title: 'ISS Time-lapse',
            thumbnail: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=400&h=400&fit=crop',
            videoUrl: 'https://www.youtube.com/embed/4czjS9h4Fpg'
        },
        { 
            id: 3, 
            type: 'image', 
            title: 'Spiral Galaxy',
            thumbnail: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&h=400&fit=crop'
        },
        { 
            id: 4, 
            type: 'image', 
            title: 'Saturn and Rings',
            thumbnail: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=400&h=400&fit=crop'
        },
        { 
            id: 5, 
            type: 'image', 
            title: 'Aurora Borealis',
            thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=400&fit=crop'
        },
        { 
            id: 6, 
            type: 'video', 
            title: 'Solar System Journey',
            thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=400&fit=crop',
            videoUrl: 'https://www.youtube.com/embed/libKVRa01L8'
        },
        { 
            id: 7, 
            type: 'image', 
            title: 'Horsehead Nebula',
            thumbnail: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=400&fit=crop'
        },
        { 
            id: 8, 
            type: 'image', 
            title: 'Mars Rover Discovery',
            thumbnail: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&h=400&fit=crop'
        },
        { 
            id: 9, 
            type: 'image', 
            title: 'Milky Way Galaxy',
            thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop'
        },
        { 
            id: 10, 
            type: 'video', 
            title: 'Black Hole Visualization',
            thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=400&fit=crop',
            videoUrl: 'https://www.youtube.com/embed/t9YLtDJZtPY'
        },
        { 
            id: 11, 
            type: 'image', 
            title: 'Supernova Remnant',
            thumbnail: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=400&fit=crop'
        },
        { 
            id: 12, 
            type: 'image', 
            title: 'Earth from Space',
            thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop'
        }
    ];

    // Filter and sort news
    const getFilteredAndSortedNews = () => {
        let filtered = newsData;

        // Filter by category
        if (activeCategory !== 'all') {
            filtered = filtered.filter(item => item.category === activeCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.source.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        if (sortBy === 'date') {
            filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return filtered;
    };

    const filteredNews = getFilteredAndSortedNews();
    const displayedNews = filteredNews.slice(0, visibleNews);
    const hasMoreNews = visibleNews < filteredNews.length;

    // Filter gallery items
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

    // Infinite scroll
    const loadMoreNews = useCallback(() => {
        if (loading || !hasMoreNews) return;
        
        setLoading(true);
        setTimeout(() => {
            setVisibleNews(prev => Math.min(prev + 6, filteredNews.length));
            setLoading(false);
        }, 800);
    }, [loading, hasMoreNews, filteredNews.length]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMoreNews && !loading) {
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
    }, [hasMoreNews, loading, loadMoreNews]);

    // Reset visible news when filters change
    useEffect(() => {
        setVisibleNews(6);
    }, [searchTerm, activeCategory, sortBy]);

    return (
        <div className="member6-container">
            {/* Header with Search */}
            <header className="media-header">
                <h1>🌌 Cosmic Library</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search news, images, topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn" onClick={() => handleSearch(searchTerm)}>🔍</button>
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
                            Found {filteredNews.length} result{filteredNews.length !== 1 ? 's' : ''} for "<strong style={{ color: '#8b5cf6' }}>{searchTerm}</strong>"

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
                                            <div className="trending-image" style={{ backgroundImage: `url(${item.image})` }}>
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