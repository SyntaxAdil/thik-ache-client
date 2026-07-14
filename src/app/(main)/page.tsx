// app/page.tsx
import React from "react";
import HeroBanner from "../../components/pages/home/hero-banner";
import HowItWorksSection from "../../components/pages/home/how-it-works";
import { NearbyRequestsSection } from "../../components/pages/home/nearby-requests";
import { auth } from "../../lib/auth/auth";
import { headers } from "next/headers";
import { CommunityVoicesSection } from "../../components/pages/home/community-voices";
import { FAQSection } from "../../components/pages/home/faq-section";
import { helpRequestService } from "../../services/help-request.service";
import { reviewService } from "../../services/review.service";

interface NearbyRequest {
  _id: string;
  title: string;
  areaLabel: string;
  budget?: number;
  isPaid?: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  postedBy: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt?: string;
}

interface CommunityReview {
  _id: string;
  rating: number;
  comment: string;
  reviewer: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };
  createdAt?: string;
}

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const userArea = user?.area || "Mirpur";

  let nearbyRequests: NearbyRequest[] = [];
  let reviews: CommunityReview[] = [];

  try {
    const response = await helpRequestService.getHelpRequests({
      area: userArea,
      limit: 4,
    });

    if (response && typeof response === "object") {
      if ("items" in response && Array.isArray(response.items)) {
        nearbyRequests = response.items as NearbyRequest[];
      } else if (Array.isArray(response)) {
        nearbyRequests = response as NearbyRequest[];
      }
    }

    nearbyRequests = nearbyRequests.filter(
      (item) => item.status === "open" || item.status === "matched"
    );

    const reviewsResponse = await reviewService.getRecentReviews(3);
    if (Array.isArray(reviewsResponse)) {
      reviews = reviewsResponse as CommunityReview[];
    }
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }

  return (
    <div>
      <HeroBanner />
      <HowItWorksSection />
      <NearbyRequestsSection userArea={userArea} initialRequests={nearbyRequests} />
      <CommunityVoicesSection initialReviews={reviews} />
      <FAQSection />
    </div>
  );
};

export default Home;