// components/dashboard/admin/admin-stats.tsx
import React from "react";
import { Users, ClipboardList, Star, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { DashboardStatsCard } from "./dashboard-stats-card";

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
}

interface HelpRequestItem {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface AdminStatsProps {
  users: UserSummary[];
  reviews: ReviewItem[];
  requests: HelpRequestItem[];
}

export function AdminStats({ users, reviews, requests }: AdminStatsProps) {
  const totalUsers = users.length;
  const totalRequests = requests.length;
  const totalReviews = reviews.length;
  const completedRequests = requests.filter((r) => r.status === "completed").length;
  const openRequests = requests.filter((r) => r.status === "open" || r.status === "matched").length;
  
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc: number, r: ReviewItem) => acc + r.rating, 0) / reviews.length
    : 0;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "Total Requests",
      value: totalRequests,
      icon: ClipboardList,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Completed Tasks",
      value: completedRequests,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Open Requests",
      value: openRequests,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      title: "Avg Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
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