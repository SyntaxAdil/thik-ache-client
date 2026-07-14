// components/shared/community-stats.tsx
import React from "react";
import { Users2, Award, CheckCircle2, ShieldAlert } from "lucide-react";
import { reviewService } from "@/services/review.service";
import { helpRequestService } from "@/services/help-request.service";
import { userService } from "@/services/user.service";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  glowClass: string;
}

const StatCard = ({ title, value, description, icon: Icon, colorClass, glowClass }: StatCardProps) => (
  <div className="relative group p-6 rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden transition-all duration-300 hover:border-zinc-800">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full filter blur-2xl opacity-10 transition-opacity group-hover:opacity-20 ${glowClass}`} />
    
    <div className="flex items-center justify-between w-full">
      <div className="space-y-1">
        <p className="text-2xs font-bold uppercase tracking-wider text-zinc-500">{title}</p>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-zinc-900/50 border border-zinc-850 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="text-2xs text-zinc-500 leading-relaxed mt-4 font-medium">{description}</p>
  </div>
);

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
  createdAt: string;
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

function getUserId(user: UserSummary | string | undefined): string {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id || "";
}

export default async function CommunityStats() {
  let totalMembers = 0;
  let completedProjects = 0;
  let averageRating = 0;
  let activeTasks = 0;

  try {
    const [usersResponse, reviewsResponse, requestsResponse] = await Promise.all([
      userService.getAllUsers(),
      reviewService.getAllReviews(),
      helpRequestService.getHelpRequests({ limit: 100 }),
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

    totalMembers = users.length;

    const completedRequests = requests.filter((req) => req.status === "completed");
    completedProjects = completedRequests.length;

    const completedTasksByUser = requests.filter((req) => {
      const helperId = getUserId(req.helper);
      return req.status === "completed" && helperId;
    });

    const allRatings = reviews.map((review) => review.rating);
    if (allRatings.length > 0) {
      const sum = allRatings.reduce((acc, val) => acc + val, 0);
      averageRating = Math.round((sum / allRatings.length) * 10) / 10;
    }

    const activeRequests = requests.filter(
      (req) => req.status === "open" || req.status === "matched" || req.status === "in_progress"
    );
    activeTasks = activeRequests.length;

  } catch (error) {
    console.error("Error fetching community stats:", error);
  }

  const statistics = [
    {
      title: "Total Members",
      value: totalMembers > 0 ? `${totalMembers}+` : "0",
      description: "Total number of developers registered on the platform.",
      icon: Users2,
      colorClass: "text-indigo-400",
      glowClass: "bg-indigo-500",
    },
    {
      title: "Completed Projects",
      value: completedProjects > 0 ? `${completedProjects}` : "0",
      description: "Total projects successfully completed and reviewed.",
      icon: CheckCircle2,
      colorClass: "text-emerald-400",
      glowClass: "bg-emerald-500",
    },
    {
      title: "Average Rating",
      value: averageRating > 0 ? `${averageRating.toFixed(1)}` : "0.0",
      description: "Overall peer rating calculated from all member reviews.",
      icon: Award,
      colorClass: "text-amber-400",
      glowClass: "bg-amber-500",
    },
    {
      title: "Active Tasks",
      value: activeTasks > 0 ? `${activeTasks}` : "0",
      description: "Current ongoing projects and tasks in development.",
      icon: ShieldAlert,
      colorClass: "text-rose-400",
      glowClass: "bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statistics.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}