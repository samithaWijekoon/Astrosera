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

const Home = () => {
    return (
        <>
            <div id="main"><Hero /></div>
            <div id="about"><RagExplanationSection /></div>
            <FeaturesSection />
            <div id="chat"><DailyQuizSection /></div>
            <LocationFeature />
            <div id="news"><EventsSection /></div>
            <StatsSection />
            <PricingSection />
            <div id="dashboard"><GetStartedSection /></div>
        </>
    )
}

export default Home
