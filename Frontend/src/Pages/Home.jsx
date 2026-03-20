import React from 'react'
import Hero from '../component/landingpage/Hero'
import RagExplanationSection from '../component/landingpage/RagExplanationSection'
import FeaturesSection from '../component/landingpage/FeaturesSection'
import DailyQuizSection from '../component/landingpage/DailyQuizSection'
import EventsSection from '../component/landingpage/EventsSection'
import StatsSection from '../component/landingpage/StatsSection'
import GetStartedSection from '../component/landingpage/GetStartedSection'
import PricingSection from '../component/landingpage/PricingSection'
import LocationFeature from '../component/landingpage/LocationFeature'
import NewsFeedSection from '../component/landingpage/NewsFeedSection'
import useScrollReveal from '../hooks/useScrollReveal'

/* ── Scroll-reveal wrapper ───────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => {
    const ref = useScrollReveal();
    return (
        <div
            ref={ref}
            className="scroll-reveal"
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const Home = () => {
    return (
        <>
            {/* Hero has its own entrance, no wrapper needed */}
            <div id="main"><Hero /></div>

            <Reveal delay={0}><div id="about"><RagExplanationSection /></div></Reveal>
            <Reveal delay={0}><FeaturesSection /></Reveal>
            <Reveal delay={0}><div id="chat"><DailyQuizSection /></div></Reveal>
            <Reveal delay={0}><LocationFeature /></Reveal>
            <Reveal delay={0}><div id="news-feed"><NewsFeedSection /></div></Reveal>
            <Reveal delay={0}><div id="events"><EventsSection /></div></Reveal>
            <Reveal delay={0}><StatsSection /></Reveal>
            <Reveal delay={0}><PricingSection /></Reveal>
            <Reveal delay={0}><div id="dashboard"><GetStartedSection /></div></Reveal>
        </>
    )
}

export default Home
