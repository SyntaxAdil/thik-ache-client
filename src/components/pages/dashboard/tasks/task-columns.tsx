// components/my-tasks/task-columns.tsx
"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Column } from "@/components/shared/table-pagination";

export interface Task {
  _id: string;
  title: string;
  areaLabel: string;
  budget?: number;
  isPaid: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  category: string;
  postedBy: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  matched: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  matched: "Matched",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const taskColumns: Column<Task>[] = [
  {
    header: "Task Details",
    render: (row: Task) => (
      <div className="space-y-0.5">
        <p className="font-semibold text-white text-sm line-clamp-1">
          {row.title}
        </p>
        <p className="text-xs text-zinc-500">
          {row.postedBy?.name || "Unknown"}
        </p>
      </div>
    ),
  },
  {
    header: "Category",
    render: (row: Task) => (
      <span className="text-xs font-medium text-zinc-400 uppercase">
        {row.category}
      </span>
    ),
  },
  {
    header: "Location",
    render: (row: Task) => (
      <span className="text-sm text-zinc-400">{row.areaLabel}</span>
    ),
  },
  {
    header: "Budget",
    render: (row: Task) =>
      row.isPaid ? (
        <span className="text-sm font-semibold text-emerald-400">
          ৳{row.budget || 0}
        </span>
      ) : (
        <span className="text-xs text-zinc-500">Voluntary</span>
      ),
  },
  {
    header: "Posted",
    render: (row: Task) => (
      <span className="text-sm text-zinc-400">
        {row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A"}
      </span>
    ),
  },
  {
    header: "Status",
    render: (row: Task) => (
      <Badge
        className={`${
          statusColors[row.status] || "bg-zinc-900 border-zinc-850 text-zinc-300"
        } border px-2.5 py-0.5 text-xs font-medium rounded-full`}
      >
        {statusLabels[row.status] || row.status}
      </Badge>
    ),
  },
  {
    header: "Action",
    render: (row: Task) => (
      <Link href={`/explore/${row._id}`}>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs font-medium">
          <Eye className="h-3.5 w-3.5" />
          Details
        </button>
      </Link>
    ),
  },
];