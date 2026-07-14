// components/dashboard/admin/admin-dashboard.tsx
import React from "react";
import { AdminStats } from "./admin-stats";
import { AdminCharts } from "./admin-charts";
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
}

interface HelpRequestItem {
  _id: string;
  title: string;
  category: string;
  areaLabel: string;
  budget?: number;
  isPaid: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

interface AdminDashboardProps {
  users: UserSummary[];
  reviews: ReviewItem[];
  requests: HelpRequestItem[];
}

export function AdminDashboard({ users, reviews, requests }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of platform activity and performance</p>
      </div>

      <AdminStats users={users} reviews={reviews} requests={requests} />
      
      <AdminCharts requests={requests} reviews={reviews} users={users} />

      <DashboardRequestsTable
        requests={requests}
        title="Recent Requests"
        description="Latest 6 help requests across the platform"
        emptyMessage="No requests found"
      />
    </div>
  );
}