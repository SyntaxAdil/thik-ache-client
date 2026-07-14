"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "../../shared/review-card";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { Marquee } from "../../ui/marquee";


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
  
  return (
    <section className="py-24 w-full bg-black tracking-tight select-none overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-0">
          <SectionHeading
            title="Community Voices"
            subtitle="See how neighbors are supporting each other and building trusted connections across the city."
            align="center"
            className="max-w-2xl text-zinc-400 font-normal"
          />
        </div>

        {initialReviews.length === 0 ? (
          <div className="text-center py-0 text-zinc-500">
            <p>No community reviews yet.</p>
          </div>
        ) : (
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:40s]">
              {initialReviews.map((review) => (
                <div key={review._id} className="mx-4">
                  <ReviewCard
                  variant="compact"
                    rating={review.rating}
                    comment={review.comment}
                    direction="helper_to_requester"
                    reviewer={{
                      name: review.reviewer.name,
                      role: review.reviewer.role || "Community Member",
                      avatarUrl: review.reviewer.avatarUrl,
                    }}
                  />
                </div>
              ))}
            </Marquee>
            {/* Gradient masks for smooth edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black via-transparent to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black via-transparent to-transparent"></div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/community"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Explore all updates from the community
            <ArrowRight className="h-3.5 w-3.5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}