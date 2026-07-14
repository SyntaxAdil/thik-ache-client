// components/community/community-columns.tsx
"use client";

import { Column } from "@/components/shared/table-pagination";
import { Star, ShieldCheck, MapPin } from "lucide-react";

export interface MemberLog {
  id: string;
  name: string;
  role: string;
  location: string;
  completedTasks: number;
  rating: number;
  latestReview: {
    reviewer: string;
    comment: string;
  };
}

export const communityColumns: Column<MemberLog>[] = [
  {
    header: "Verified Operator",
    render: (row: MemberLog) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer">
            {row.name}
          </span>
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
        </div>
        <p className="text-2xs text-zinc-500 font-medium">{row.role}</p>
      </div>
    ),
  },
  {
    header: "Grid Coordinates",
    render: (row: MemberLog) => (
      <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
        <MapPin className="h-3 w-3 text-zinc-600 shrink-0" />
        <span>{row.location}</span>
      </div>
    ),
  },
  {
    header: "Trust Output",
    render: (row: MemberLog) => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1 text-amber-400 font-bold">
          <Star className="h-3 w-3 fill-current shrink-0" />
          <span>{row.rating.toFixed(2)}</span>
        </div>
        <p className="text-2xs text-zinc-500 font-semibold uppercase tracking-wider">
          {row.completedTasks} Tasks Done
        </p>
      </div>
    ),
  },
  {
    header: "Reciprocal Peer Review Matrix",
    render: (row: MemberLog) => (
      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900/60 space-y-1 max-w-sm sm:max-w-md">
        <p className="text-2xs text-zinc-400 leading-relaxed italic">
          &quot;{row.latestReview.comment}&quot;
        </p>
        <div className="flex items-center gap-1 text-2xs text-zinc-600 font-mono font-bold">
          <span>— via</span>
          <span className="text-zinc-500">{row.latestReview.reviewer}</span>
        </div>
      </div>
    ),
  },
];