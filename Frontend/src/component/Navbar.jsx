import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const mobileRef = useRef(null);

    /* Shrink nav on scroll (Apple-style) */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Close mobile menu on route change */
    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Chat', path: '/chat' },
        { name: 'Events', path: '/events' },
        { name: 'Quiz', path: '/quiz' },
        { name: 'Achievements', path: '/achievements' },
        { name: 'News', path: '/news' },
    ];
    if (user?.role === 'admin') navLinks.push({ name: 'Analytics', path: '/admin' });

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ── Main bar ──────────────────────────────────────── */}
            <nav
                className="fixed top-0 left-0 w-full z-[100] transition-all duration-500"
                style={{
                    background: scrolled
                        ? 'rgba(5, 5, 15, 0.78)'
                        : 'rgba(5, 5, 15, 0.60)',
                    backdropFilter: 'saturate(180%) blur(28px)',
                    WebkitBackdropFilter: 'saturate(180%) blur(28px)',
                    borderBottom: '1px solid rgba(255,255,255,0.09)',
                    boxShadow: scrolled
                        ? '0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.4)'
                        : '0 1px 0 rgba(255,255,255,0.04) inset',
                }}
            >
                <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-14">

                    {/* ── Logo ──────────────────────────────────── */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0 focus:outline-none group">
                        <img src="/logo.png" alt="Astrosera" className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
                    </Link>

                    {/* ── Desktop links (centred) ────────────────── */}
                    <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-200 focus:outline-none"
                                style={{
                                    color: isActive(link.path)
                                        ? '#fff'
                                        : 'rgba(255,255,255,0.65)',
                                    background: isActive(link.path)
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'transparent',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive(link.path))
                                        e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                }}
                                onMouseLeave={e => {
                                    if (!isActive(link.path)) {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {link.name}
                                {/* Active underline dot */}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* ── Right side ────────────────────────────── */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                {/* Avatar + username */}
                                <Link to="/profile"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 focus:outline-none"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                                        {user.avatarInitials || user.username?.[0]?.toUpperCase()}
                                    </span>
                                    <span className="text-[13px] font-medium text-white/80">{user.username}</span>
                                </Link>

                                {/* Logout */}
                                <button onClick={logout}
                                    className="px-4 py-1.5 rounded-xl text-[13px] font-semibold text-white/80 transition-all duration-200 focus:outline-none active:scale-95"
                                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/login"
                                    className="px-4 py-1.5 rounded-xl text-[13px] font-medium text-white/70 hover:text-white transition-colors focus:outline-none">
                                    Sign In
                                </Link>
                                <Link to="/signup"
                                    className="px-4 py-1.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 active:scale-95 focus:outline-none"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.35)' }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.55)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.35)'}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile burger */}
                        <button
                            onClick={() => setIsOpen(o => !o)}
                            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                            aria-label="Toggle menu"
                        >
                            {isOpen
                                ? <HiX className="text-white text-xl" />
                                : <HiMenu className="text-white text-xl" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile drawer ─────────────────────────────────── */}
            <div
                className="lg:hidden fixed inset-0 z-40 pointer-events-none"
                style={{ top: 56 }}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        opacity: isOpen ? 1 : 0,
                        pointerEvents: isOpen ? 'auto' : 'none',
                    }}
                    onClick={() => setIsOpen(false)}
                />

                {/* Panel */}
                <div
                    ref={mobileRef}
                    className="absolute left-0 right-0 transition-all duration-300 overflow-hidden"
                    style={{
                        background: 'rgba(10,10,22,0.65)',
                        backdropFilter: 'saturate(200%) blur(32px)',
                        WebkitBackdropFilter: 'saturate(200%) blur(32px)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 40px rgba(0,0,0,0.4)',
                        maxHeight: isOpen ? '500px' : '0px',
                        pointerEvents: isOpen ? 'auto' : 'none',
                    }}
                >
                    <div className="px-5 py-4 flex flex-col gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-150 focus:outline-none"
                                style={{
                                    color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.65)',
                                    background: isActive(link.path) ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                                    border: isActive(link.path) ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                {isActive(link.path) && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                                )}
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile auth */}
                        <div className="mt-2 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                                            {user.avatarInitials || user.username?.[0]?.toUpperCase()}
                                        </span>
                                        <span className="text-sm font-medium text-white/80">{user.username}</span>
                                    </Link>
                                    <button onClick={() => { logout(); setIsOpen(false); }}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 transition-all active:scale-[0.98] focus:outline-none text-left"
                                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 rounded-xl text-sm font-medium text-white/70 text-center"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        Sign In
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)}
                                        className="px-4 py-3 rounded-xl text-sm font-bold text-white text-center active:scale-[0.98]"
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 18px rgba(124,58,237,0.3)' }}>
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;