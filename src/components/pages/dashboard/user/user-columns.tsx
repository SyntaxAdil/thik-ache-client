// components/user/user-columns.tsx
"use client";

import { Column } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Eye } from "lucide-react";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  image?: string;
  avatarUrl?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const userColumns: Column<UserData>[] = [
  {
    header: "User",
    render: (row: UserData) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-zinc-800">
          <AvatarImage src={row.image || row.avatarUrl} />
          <AvatarFallback className="bg-zinc-900 text-zinc-400">
            {row.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="font-semibold text-white text-sm">
            {row.name || "Unknown"}
          </p>
          <p className="text-xs text-zinc-500">
            {row.email || "No email"}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Role",
    render: (row: UserData) => (
      <Badge
        className={`${
          row.role === "admin"
            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
            : "bg-zinc-900 text-zinc-400 border-zinc-800"
        } border px-2.5 py-0.5 text-xs font-medium rounded-full`}
      >
        {row.role || "user"}
      </Badge>
    ),
  },
  {
    header: "Location",
    render: (row: UserData) => (
      <span className="text-sm text-zinc-400">
        {row.area || "Not specified"}
      </span>
    ),
  },
  {
    header: "Rating",
    render: (row: UserData) => (
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-amber-400">
          {row.avgRating ? row.avgRating.toFixed(1) : "N/A"}
        </p>
        <p className="text-xs text-zinc-500">
          {row.completedCount || 0} tasks
        </p>
      </div>
    ),
  },
  {
    header: "Joined",
    render: (row: UserData) => (
      <span className="text-sm text-zinc-500">
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
];