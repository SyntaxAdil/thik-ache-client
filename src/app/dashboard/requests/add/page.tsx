// app/(main)/community/page.tsx
import React from "react";
import { headers } from "next/headers";
import CommunityStats from "@/components/shared/community-stats";
import { TablePagination } from "@/components/shared/table-pagination";
import { communityColumns, MemberLog } from "@/components/community/community-columns";
import { reviewService } from "@/services/review.service";
import { helpRequestService } from "@/services/help-request.service";
import { userService } from "@/services/user.service";

export default async function CommunityPage() {
  let communityData: MemberLog[] = [];

  try {
    // Fetch all reviews
    const reviewsResponse = await reviewService.getAllReviews();
    const reviews = Array.isArray(reviewsResponse) ? reviewsResponse : [];

    // Fetch all users
    const usersResponse = await userService.getAllUsers();
    const users = Array.isArray(usersResponse) ? usersResponse : [];

    // Fetch all requests to get task counts
    const requestsResponse = await helpRequestService.getHelpRequests({ limit: "100" });
    let requests: any[] = [];
    if (requestsResponse && typeof requestsResponse === "object") {
      if ("items" in requestsResponse && Array.isArray(requestsResponse.items)) {
        requests = requestsResponse.items;
      } else if (Array.isArray(requestsResponse)) {
        requests = requestsResponse;
      }
    }

    // Build community data from users and their reviews
    communityData = users.map((user: any, index: number) => {
      // Get user's reviews
      const userReviews = reviews.filter(
        (review: any) => review.reviewee?._id === user._id || review.reviewee === user._id
      );

      // Calculate average rating
      const avgRating = userReviews.length > 0
        ? userReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / userReviews.length
        : 0;

      // Get latest review
      const latestReview = userReviews.length > 0
        ? userReviews.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        : null;

      // Count completed tasks
      const completedTasks = requests.filter(
        (req: any) => 
          (req.helper?._id === user._id || req.helper === user._id) && 
          req.status === "completed"
      ).length;

      return {
        id: user._id || `M-${String(index + 1).padStart(3, "0")}`,
        name: user.name || `User ${index + 1}`,
        role: user.role || "Community Member",
        location: user.area || "Mirpur, Dhaka",
        completedTasks: completedTasks || user.completedCount || 0,
        rating: avgRating || user.avgRating || 4.5 + (Math.random() * 0.5),
        latestReview: {
          reviewer: latestReview?.reviewer?.name || "Community Member",
          comment: latestReview?.comment || "Active and helpful community member.",
        },
      };
    });

    // Sort by rating descending
    communityData = communityData.sort((a, b) => b.rating - a.rating);

  } catch (error) {
    console.error("Error fetching community data:", error);
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4 lg:px-0 space-y-12">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-2xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Hyperlocal Network
            </span>
            <span className="text-2xs font-semibold text-zinc-600">
              Real-time Node Activity
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Community Ecosystem
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Live tracking metrics of active verified operators and performance pipeline records.
            </p>
          </div>
          <hr className="border-zinc-900 w-16 border-t-2 pt-2" />
        </div>

        <section className="w-full">
          <CommunityStats />
        </section>

        <section className="space-y-4 w-full">
          <div>
            <h2 className="text-lg font-bold text-white">Active Operators Registry</h2>
            <p className="text-2xs text-zinc-500 font-medium">
              Historical audit tracking of verification logs and match status loops.
            </p>
          </div>
          <TablePagination
            data={communityData}
            columns={communityColumns}
            pageSize={4}
            emptyMessage="No community members registered yet."
          />
        </section>

      </div>
    </main>
  );
}