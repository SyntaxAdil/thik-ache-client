import React from "react";
import HeroBanner from "../../components/pages/home/hero-banner";
import HowItWorksSection from "../../components/pages/home/how-it-works";
import { NearbyRequestsSection } from "../../components/pages/home/nearby-requests";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { CommunityVoicesSection } from "../../components/pages/home/community-voices";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  return (
    <div>
      <HeroBanner></HeroBanner>
      <HowItWorksSection></HowItWorksSection>
      <NearbyRequestsSection userArea={user?.area || "Dhanmondi"}></NearbyRequestsSection>
      <CommunityVoicesSection></CommunityVoicesSection>
    </div>
  );
};

export default Home;
