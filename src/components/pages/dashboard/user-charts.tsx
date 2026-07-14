// components/dashboard/user/user-charts.tsx
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
  Legend,
} from "recharts";

interface HelpRequestItem {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface UserChartsProps {
  userRequests: HelpRequestItem[];
  userPosted: HelpRequestItem[];
  userHelping: HelpRequestItem[];
}

const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171"];

export function UserCharts({ userRequests, userPosted, userHelping }: UserChartsProps) {
  const statusMap: Record<string, number> = {};
  userRequests.forEach((r) => {
    statusMap[r.status] = (statusMap[r.status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({
    name: name.replace("_", " ").toUpperCase(),
    value,
  }));

  const activityData = [
    { name: "Posted", value: userPosted.length },
    { name: "Helping", value: userHelping.length },
  ].filter((d) => d.value > 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthData = monthNames.map((month, index) => {
    const count = userRequests.filter((r) => {
      if (!r.createdAt) return false;
      const date = new Date(r.createdAt);
      return date.getMonth() === index && date.getFullYear() === 2026;
    }).length;
    return { name: month, activities: count };
  });

  return (
    <>
      <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-6 flex-1">
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

      

      
    </>
  );
}