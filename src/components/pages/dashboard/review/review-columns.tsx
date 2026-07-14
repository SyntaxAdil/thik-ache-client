// components/review/review-columns.tsx
"use client";

import { Column } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";

export interface ReviewData {
  _id: string;
  rating: number;
  comment: string;
  reviewer: {
    _id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  reviewee: {
    _id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  request: {
    _id: string;
    title: string;
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-600"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-amber-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export const reviewColumns: Column<ReviewData>[] = [
  {
    header: "Reviewer",
    render: (row: ReviewData) => (
      <div className="space-y-0.5">
        <p className="font-semibold text-white text-sm">
          {row.reviewer?.name || "Unknown"}
        </p>
        <p className="text-xs text-zinc-500">
          {row.reviewer?.email || "No email"}
        </p>
      </div>
    ),
  },
  {
    header: "Reviewee",
    render: (row: ReviewData) => (
      <div className="space-y-0.5">
        <p className="font-semibold text-white text-sm">
          {row.reviewee?.name || "Unknown"}
        </p>
        <p className="text-xs text-zinc-500">
          {row.reviewee?.email || "No email"}
        </p>
      </div>
    ),
  },
  {
    header: "Request",
    render: (row: ReviewData) => (
      <div className="space-y-0.5">
        <p className="text-sm text-zinc-300 line-clamp-1">
          {row.request?.title || "N/A"}
        </p>
        <Badge variant="outline" className="text-[10px] font-medium uppercase text-zinc-500 border-zinc-800">
          {row.request?.category || "Unknown"}
        </Badge>
      </div>
    ),
  },
  {
    header: "Rating",
    render: (row: ReviewData) => renderStars(row.rating),
  },
  {
    header: "Comment",
    render: (row: ReviewData) => (
      <p className="text-sm text-zinc-400 line-clamp-2 max-w-xs">
        {row.comment || "No comment"}
      </p>
    ),
  },
  {
    header: "Date",
    render: (row: ReviewData) => (
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