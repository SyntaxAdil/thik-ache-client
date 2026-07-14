// app/dashboard/page.tsx
import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { helpRequestService } from "@/services/help-request.service";
import { reviewService } from "@/services/review.service";
import { userService } from "@/services/user.service";
import { AdminDashboard } from "../../components/pages/dashboard/admin-dashboard";
import { UserDashboard } from "../../components/pages/dashboard/user-dashboard";


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
  shortDescription: string;
  fullDescription: string;
  category: string;
  areaLabel: string;
  budget?: number;
  isPaid: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  postedBy: UserSummary | string;
  helper?: UserSummary | string;
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

export default async function DashboardPage() {
  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const [usersResponse, reviewsResponse, requestsResponse] = await Promise.all([
    userService.getAllUsers(),
    reviewService.getAllReviews(),
    helpRequestService.getHelpRequests({ limit:100 }),
  ]);

  const users = Array.isArray(usersResponse) ? (usersResponse as UserSummary[]) : [];
  const reviews = Array.isArray(reviewsResponse) ? (reviewsResponse as ReviewItem[]) : [];

  let requests: HelpRequestItem[] = [];
  if (requestsResponse && typeof requestsResponse === "object") {
    const paginated = requestsResponse as PaginatedResponse;
    if ("items" in paginated && Array.isArray(paginated.items)) {
      requests = paginated.items as HelpRequestItem[];
    } else if (Array.isArray(requestsResponse)) {
      requests = requestsResponse as HelpRequestItem[];
    }
  }

  if (role === "admin") {
    return <AdminDashboard users={users} reviews={reviews} requests={requests} />;
  }

  return <UserDashboard userId={userId || ""} requests={requests} reviews={reviews} />;
}