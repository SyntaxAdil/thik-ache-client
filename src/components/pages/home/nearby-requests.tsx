"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { HelpRequestCard } from "../../shared/help-request-card";
import Link from "next/link";

const MOCK_NEARBY_REQUESTS = [
  {
    _id: "601a8d3a2d2c0c1c2e1d",
    title: "Need help fixing my laptop — won't turn on",
    location: "Road 27, Dhanmondi",
    amount: 600,
    status: "OPEN" as const,
    user: {
      name: "S. Ahmed",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      timeAgo: "2m ago",
    },
  },
  {
    _id: "601a8d3a2d2c0c1c2e2d",
    title: "Looking for someone to help move a sofa this evening",
    location: "Satmasjid Road, Dhanmondi",
    amount: 450,
    status: "IN_PROGRESS" as const,
    user: {
      name: "R. Khan",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      timeAgo: "15m ago",
    },
  },
  {
    _id: "601a8d3a2d2c0c1c2e3d",
    title: "Need a spare gas cylinder until tomorrow morning",
    location: "Road 12A, Dhanmondi",
    amount: 300,
    status: "OPEN" as const,
    user: {
      name: "M. Rahman",
      avatarUrl: "",
      timeAgo: "30m ago",
    },
  },
  {
    _id: "601a8d3a2d2c0c1c2e4d",
    title: "Can someone water my plants while I'm away?",
    location: "Road 4, Dhanmondi",
    amount: 500,
    status: "CLOSED" as const,
    user: {
      name: "N. Islam",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      timeAgo: "1h ago",
    },
  },
];

export function NearbyRequestsSection({userArea}: {userArea: string}) {
  return (
    <section className="py-20 w-full bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeading
            title={`Nearby in ${userArea}`}
            subtitle="Real-time requests from your neighborhood."
            align="left"
            className="mb-0 max-w-xl"
          />

          <Link href="/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors group self-start md:self-auto pb-2">
            View all requests
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_NEARBY_REQUESTS.map((request, index) => (
            <HelpRequestCard
              key={index}
              _id={request._id}
              title={request.title}
              location={request.location}
              amount={request.amount}
              status={request.status}
              user={request.user}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
