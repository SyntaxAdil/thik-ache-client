// components/dashboard/shared/dashboard-stats-card.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  border,
}: DashboardStatsCardProps) {
  return (
    <div
      className={`p-4 rounded-xl ${bg} border ${border} transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${bg} border ${border}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}