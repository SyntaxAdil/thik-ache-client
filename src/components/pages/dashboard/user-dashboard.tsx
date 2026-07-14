// components/dashboard/user/user-dashboard.tsx
import React from "react";
import { UserStats } from "./user-stats";
import { UserCharts } from "./user-charts";
import { DashboardRequestsTable } from "./dashboard-requests-table";


interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface ReviewItem {
  _id: string;
  rating: number;
  comment: string;
  reviewer: UserSummary | string;
  reviewee: UserSummary | string;
}

interface HelpRequestItem {
  _id: string;
  title: string;
  category: string;
  areaLabel: string;
  budget?: number;
  isPaid: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  postedBy: UserSummary | string;
  helper?: UserSummary | string;
  createdAt: string;
}

interface UserDashboardProps {
  userId: string;
  requests: HelpRequestItem[];
  reviews: ReviewItem[];
}

function getUserId(user: UserSummary | string | undefined): string {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
}

export function UserDashboard({ userId, requests, reviews }: UserDashboardProps) {
  const userRequests = requests.filter((r) => {
    const postedById = getUserId(r.postedBy);
    const helperId = r.helper ? getUserId(r.helper) : "";
    return postedById === userId || helperId === userId;
  });

  const userReviews = reviews.filter((r) => {
    const revieweeId = getUserId(r.reviewee);
    const reviewerId = getUserId(r.reviewer);
    return revieweeId === userId || reviewerId === userId;
  });

  const userPosted = requests.filter((r) => getUserId(r.postedBy) === userId);
  const userHelping = requests.filter((r) => r.helper ? getUserId(r.helper) === userId : false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Track your activity and performance</p>
      </div>

      <UserStats
        userRequests={userRequests}
        userReviews={userReviews}
        userPosted={userPosted}
        userHelping={userHelping}
      />

      <div className="flex justify-between gap-4">
    

      <DashboardRequestsTable
        requests={userRequests}
        title="My Recent Requests"
        description="Latest 6 requests you've posted or helped with"
        emptyMessage="No requests found. Start helping others!"
      />
          <UserCharts
        userRequests={userRequests}
        userPosted={userPosted}
        userHelping={userHelping}
      />
      </div>
    </div>
  );
}