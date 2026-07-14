// components/dashboard/shared/dashboard-requests-table.tsx
import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

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

interface DashboardRequestsTableProps {
  requests: HelpRequestItem[];
  title: string;
  description: string;
  emptyMessage?: string;
}

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  matched: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  matched: "Matched",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function DashboardRequestsTable({
  requests,
  title,
  description,
  emptyMessage = "No requests found",
}: DashboardRequestsTableProps) {
  const recentRequests = requests.slice(0, 6);

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-900">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Title
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Category
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Area
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Budget
              </th>
              <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {recentRequests.map((request) => (
              <tr key={request._id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-3">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {request.title}
                  </p>
                </td>
                <td className="px-6 py-3">
                  <span className="text-xs text-zinc-400 uppercase">
                    {request.category?.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="text-sm text-zinc-400">{request.areaLabel}</span>
                </td>
                <td className="px-6 py-3">
                  <span className="text-sm font-medium text-emerald-400">
                    {request.isPaid ? `৳${request.budget || 0}` : "Voluntary"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                      statusColors[request.status] || "bg-zinc-900 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    {statusLabels[request.status] || request.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <Link href={`/explore/${request._id}`}>
                    <button className="p-1.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentRequests.length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-sm">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}