// components/pages/home/nearby-requests.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { HelpRequestCard } from "../../shared/help-request-card";
import Link from "next/link";
import { helpRequestService } from "@/services/help-request.service";

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

interface NearbyRequestsSectionProps {
  userArea?: string;
  initialRequests?: NearbyRequest[];
}

type RequestStatus = "open" | "matched" | "in_progress" | "completed" | "cancelled";

const VALID_STATUSES: RequestStatus[] = ["open", "matched", "in_progress", "completed", "cancelled"];

function isValidStatus(status: string): status is RequestStatus {
  return VALID_STATUSES.includes(status as RequestStatus);
}

export function NearbyRequestsSection({
  userArea,
  initialRequests = [],
}: NearbyRequestsSectionProps) {
  // Use default "Mirpur" if userArea is not provided
  const displayArea = userArea || "Mirpur";
  
  const [requests, setRequests] = useState<NearbyRequest[]>(initialRequests);
  const [loading, setLoading] = useState(initialRequests.length === 0);

  const formatTimeAgo = useMemo(() => {
    return (date?: string) => {
      if (!date) return "Recently";
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const response = await helpRequestService.getHelpRequests({
          area: displayArea,
          limit: 4,
        });

        let items: NearbyRequest[] = [];
        if (response && typeof response === "object") {
          if ("items" in response && Array.isArray(response.items)) {
            items = response.items as NearbyRequest[];
          } else if (Array.isArray(response)) {
            items = response as NearbyRequest[];
          }
        }
        
        const filteredItems = items.filter(
          (item) => item.status === "open" || item.status === "matched"
        );
        
        if (isMounted) {
          setRequests(filteredItems);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching nearby requests:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (initialRequests.length > 0) {
      setTimeout(() => {
        setLoading(false);
      }, 0);
      return;
    }

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [displayArea, initialRequests]);

  if (loading) {
    return (
      <section className="py-20 w-full bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <SectionHeading
              title={`Nearby in ${displayArea}`}
              subtitle="Real-time requests from your neighborhood."
              align="left"
              className="mb-0 max-w-xl"
            />
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors group self-start md:self-auto pb-2"
            >
              View all requests
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-zinc-900/50 animate-pulse rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 w-full bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeading
            title={`Nearby in ${displayArea}`}
            subtitle="Real-time requests from your neighborhood."
            align="left"
            className="mb-0 max-w-xl"
          />
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-indigo-400 transition-colors group self-start md:self-auto pb-2"
          >
            View all requests
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p>No active requests in {displayArea} right now.</p>
            <p className="text-sm mt-2">Check back later or expand your search area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {requests.slice(0, 4).map((request) => {
              let status: RequestStatus = "open";
              if (request.status && isValidStatus(request.status)) {
                status = request.status;
              }

              return (
                <HelpRequestCard
                  key={request._id}
                  _id={request._id}
                  title={request.title}
                  location={request.areaLabel}
                  amount={request.budget || 0}
                  isPaid={request.isPaid || false}
                  status={status}
                  user={{
                    _id: request.postedBy?._id || "",
                    name: request.postedBy?.name || "Unknown",
                    avatarUrl: request.postedBy?.avatarUrl,
                    timeAgo: formatTimeAgo(request.createdAt),
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}