import React from 'react'
import HeroBanner from '../../components/pages/home/hero-banner'
import HowItWorksSection from '../../components/pages/home/how-it-works'
import { NearbyRequestsSection } from '../../components/pages/home/nearby-requests'

const Home = () => {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <HowItWorksSection></HowItWorksSection>
      <NearbyRequestsSection></NearbyRequestsSection>
    </div>
  )
}

export default Home