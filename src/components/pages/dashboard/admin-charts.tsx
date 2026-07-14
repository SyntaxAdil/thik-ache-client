// components/dashboard/admin/admin-charts.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

interface HelpRequestItem {
  _id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

interface ReviewItem {
  _id: string;
  rating: number;
}

interface AdminChartsProps {
  requests: HelpRequestItem[];
  reviews: ReviewItem[];
  users: unknown[];
}

const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#60a5fa"];

export function AdminCharts({ requests, reviews }: AdminChartsProps) {
  const categoryMap: Record<string, number> = {};
  requests.forEach((r) => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name: name.replace("_", " ").toUpperCase(),
    value,
  }));

  const statusMap: Record<string, number> = {};
  requests.forEach((r) => {
    statusMap[r.status] = (statusMap[r.status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({
    name: name.replace("_", " ").toUpperCase(),
    value,
  }));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthData = monthNames.map((month, index) => {
    const count = requests.filter((r) => {
      if (!r.createdAt) return false;
      const date = new Date(r.createdAt);
      return date.getMonth() === index && date.getFullYear() === 2026;
    }).length;
    return { name: month, requests: count };
  });

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[Math.floor(r.rating) - 1]++;
    }
  });
  const ratingData = ratingDistribution.map((count, i) => ({
    rating: `${i + 1}★`,
    count,
  }));

  return (
    <>
      <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Requests by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData}>
            <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
            <YAxis stroke="#71717a" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Request Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Monthly Requests</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
            <YAxis stroke="#71717a" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#818cf8"
              strokeWidth={2}
              dot={{ fill: "#818cf8", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Rating Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ratingData}>
            <XAxis dataKey="rating" stroke="#71717a" fontSize={10} />
            <YAxis stroke="#71717a" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}