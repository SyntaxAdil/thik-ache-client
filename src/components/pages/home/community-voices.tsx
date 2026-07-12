"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "../../shared/review-card";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";

const MOCK_REVIEWS = [
  {
    rating: 5,
    comment: "As a student, ThikAche has been a lifesaver. I've earned extra money just by helping my elderly neighbors with their tech issues!",
    direction: "helper_to_requester" as const,
    reviewer: {
      name: "Adnan Sami",
      role: "Lalmatia Resident",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
  },
  {
    rating: 5,
    comment: "I needed someone to pick up medicine late at night when my son was sick. Within 10 minutes, a neighbor was at my door. Incredible.",
    direction: "requester_to_helper" as const,
    reviewer: {
      name: "Sabina Yasmin",
      role: "Dhanmondi Resident",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
  },
  {
    rating: 5,
    comment: "Finally a platform that feels like Dhaka. It's not just a service; it's about re-connecting with the people living next door.",
    direction: "requester_to_helper" as const,
    reviewer: {
      name: "Rakib Hossain",
      role: "Banani Resident",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
  },
];

export function CommunityVoicesSection() {
  return (
    <section className="py-24 w-full bg-black tracking-tight select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Adjusted spacing and polished copy */}
        <div className="flex flex-col items-center text-center mb-16">
          <SectionHeading
            title="Community Voices"
            subtitle="See how neighbors are supporting each other and building trusted connections across the city."
            align="center"
            className="max-w-2xl text-zinc-400 font-normal"
          />
        </div>

        {/* Responsive Grid Layout containing the MagicCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {MOCK_REVIEWS.map((review, index) => (
            <ReviewCard
              key={index}
              rating={review.rating}
              comment={review.comment}
              direction={review.direction}
              reviewer={review.reviewer}
            />
          ))}
        </div>

        {/* Professional Navigation Redirection Footnote */}
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