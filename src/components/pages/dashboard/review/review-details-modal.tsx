// components/review/review-details-modal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, User, Calendar, MessageSquare, FileText } from "lucide-react";
import { ReviewData } from "./review-columns";

interface ReviewDetailsModalProps {
  review: ReviewData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDetailsModal({
  review,
  open,
  onOpenChange,
}: ReviewDetailsModalProps) {
  if (!review) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "text-zinc-600"
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-bold text-amber-400">
          {rating.toFixed(1)}
        </span>
        <span className="text-sm text-zinc-500">/ 5.0</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Review Details
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Complete review information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Rating
              </p>
              {renderStars(review.rating)}
            </div>
            <Badge className="bg-zinc-900 border-zinc-800 text-zinc-400">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-indigo-400" />
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Reviewer
                </p>
              </div>
              <p className="text-sm font-semibold text-white">
                {review.reviewer?.name || "Unknown"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {review.reviewer?.email || "No email"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-emerald-400" />
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Reviewee
                </p>
              </div>
              <p className="text-sm font-semibold text-white">
                {review.reviewee?.name || "Unknown"}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {review.reviewee?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Request
              </p>
            </div>
            <p className="text-sm font-semibold text-white">
              {review.request?.title || "N/A"}
            </p>
            <Badge
              variant="outline"
              className="mt-1.5 text-[10px] font-medium uppercase text-zinc-500 border-zinc-800"
            >
              {review.request?.category || "Unknown"}
            </Badge>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Comment
              </p>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {review.comment || "No comment provided"}
            </p>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/20 border border-zinc-900">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <div className="flex gap-6 text-xs">
              <div>
                <span className="text-zinc-500">Created:</span>
                <span className="text-zinc-300 ml-1.5">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
              {review.updatedAt && (
                <div>
                  <span className="text-zinc-500">Updated:</span>
                  <span className="text-zinc-300 ml-1.5">
                    {new Date(review.updatedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}