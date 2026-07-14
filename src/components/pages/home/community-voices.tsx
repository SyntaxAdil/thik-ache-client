// components/pages/home/community-voices.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "../../shared/review-card";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";

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

interface CommunityVoicesSectionProps {
  initialReviews?: CommunityReview[];
}

export function CommunityVoicesSection({
  initialReviews = [],
}: CommunityVoicesSectionProps) {
  const [reviews] = useState<CommunityReview[]>(initialReviews);

  const displayedReviews = reviews.length > 0 ? reviews.slice(0, 3) : [];

  return (
    <section className="py-24 w-full bg-black tracking-tight select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            title="Community Voices"
            subtitle="See how neighbors are supporting each other and building trusted connections across the city."
            align="center"
            className="max-w-2xl text-zinc-400 font-normal"
          />
        </div>

        {displayedReviews.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p>No community reviews yet.</p>
            <p className="text-sm mt-2">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-12">
            {displayedReviews.map((review) => (
              <ReviewCard
                key={review._id}
                rating={review.rating}
                comment={review.comment}
                direction="helper_to_requester"
                reviewer={{
                  name: review.reviewer.name,
                  role: review.reviewer.role || "Community Member",
                  avatarUrl: review.reviewer.avatarUrl,
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/community"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Explore all updates from the community
            <ArrowRight className="h-3.5 w-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}