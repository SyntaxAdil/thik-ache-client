// components/dashboard/user/user-stats.tsx
import React from "react";
import { ClipboardList, CheckCircle, Clock, TrendingUp, Users, Star } from "lucide-react";
import { DashboardStatsCard } from "./dashboard-stats-card";

interface HelpRequestItem {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface ReviewItem {
  _id: string;
  rating: number;
}

interface UserStatsProps {
  userRequests: HelpRequestItem[];
  userReviews: ReviewItem[];
  userPosted: HelpRequestItem[];
  userHelping: HelpRequestItem[];
}

export function UserStats({ userRequests, userReviews, userPosted, userHelping }: UserStatsProps) {
  const totalRequests = userRequests.length;
  const completedRequests = userRequests.filter((r) => r.status === "completed").length;
  const openRequests = userRequests.filter((r) => r.status === "open" || r.status === "matched").length;
  const postedCount = userPosted.length;
  const helpingCount = userHelping.length;

  const avgRating = userReviews.length > 0
    ? userReviews.reduce((acc: number, r: ReviewItem) => acc + r.rating, 0) / userReviews.length
    : 0;

  const stats = [
    {
      title: "Total Activity",
      value: totalRequests,
      icon: ClipboardList,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "Completed",
      value: completedRequests,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "In Progress",
      value: openRequests,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Posted",
      value: postedCount,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Helping",
      value: helpingCount,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Avg Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "0.0",
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <DashboardStatsCard key={idx} {...stat} />
      ))}
    </div>
  );
}