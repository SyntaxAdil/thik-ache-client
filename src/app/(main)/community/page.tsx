// app/(main)/community/page.tsx
import React from "react";
import CommunityStats from "@/components/shared/community-stats";
import { reviewService } from "@/services/review.service";
import { helpRequestService } from "@/services/help-request.service";
import { userService } from "@/services/user.service";
import { MemberLog } from "../../../components/pages/community/community-columns";
import { CommunityTable } from "../../../components/pages/community/community-table";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Community",
  description: "Join the ThikAche community network. A space where neighbors connect, share skills, and foster a safer, more helpful Dhaka.",
  openGraph: {
    title: "Community | ThikAche",
    description: "Join the ThikAche community network. A space where neighbors connect, share skills, and foster a safer, more helpful Dhaka.",
  }
};
interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  avatarUrl?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewItem {
  _id: string;
  rating: number;
  comment: string;
  reviewer: UserSummary | string;
  reviewee: UserSummary | string;
  request: {
    _id: string;
    title: string;
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface HelpRequestItem {
  _id: string;
  title: string;
  status: string;
  helper: UserSummary | string;
  postedBy: UserSummary | string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  items?: HelpRequestItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getUserName(user: UserSummary | string | undefined): string {
  if (!user) return "Unknown User";
  if (typeof user === "string") return "Unknown User";
  return user.name || "Unknown User";
}

function getUserId(user: UserSummary | string | undefined): string {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
}

export default async function CommunityPage() {
  let communityData: MemberLog[] = [];

  try {
    const [reviewsResponse, usersResponse, requestsResponse] = await Promise.all([
      reviewService.getAllReviews(),
      userService.getAllUsers(),
      helpRequestService.getHelpRequests({ limit: 100 }),
    ]);

    const reviews = Array.isArray(reviewsResponse) ? (reviewsResponse as ReviewItem[]) : [];
    const users = Array.isArray(usersResponse) ? (usersResponse as UserSummary[]) : [];

    let requests: HelpRequestItem[] = [];
    if (requestsResponse && typeof requestsResponse === "object") {
      const paginated = requestsResponse as PaginatedResponse;
      if ("items" in paginated && Array.isArray(paginated.items)) {
        requests = paginated.items as HelpRequestItem[];
      } else if (Array.isArray(requestsResponse)) {
        requests = requestsResponse as HelpRequestItem[];
      }
    }

    communityData = users.map((user: UserSummary) => {
      const userReviews = reviews.filter((review: ReviewItem) => {
        const revieweeId = getUserId(review.reviewee);
        return revieweeId === user._id;
      });

      const avgRating = userReviews.length > 0
        ? userReviews.reduce((acc: number, r: ReviewItem) => acc + r.rating, 0) / userReviews.length
        : 0;

      const sortedReviews = [...userReviews].sort(
        (a: ReviewItem, b: ReviewItem) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const latestReview = sortedReviews.length > 0 ? sortedReviews[0] : null;

      const completedTasks = requests.filter((req: HelpRequestItem) => {
        const helperId = getUserId(req.helper);
        return helperId === user._id && req.status === "completed";
      }).length;

      return {
        id: user._id,
        name: user.name || "Unknown User",
        role: user.role || "Community Member",
        location: user.area || "Mirpur, Dhaka",
        completedTasks: completedTasks || user.completedCount || 0,
        rating: avgRating || user.avgRating || 0,
        latestReview: {
          reviewer: latestReview ? getUserName(latestReview.reviewer) : "Community Member",
          comment: latestReview?.comment || "Active and helpful community member.",
        },
      };
    });

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
          <CommunityTable 
            data={communityData}
            pageSize={4}
            emptyMessage="No community members registered yet."
          />
        </section>
      </div>
    </main>
  );
}