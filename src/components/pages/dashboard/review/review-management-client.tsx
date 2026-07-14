// components/review/review-management-client.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { ReusableTablePagination } from "@/components/shared/table-pagination";
import { ReviewData, reviewColumns } from "./review-columns";
import { ReviewDetailsModal } from "./review-details-modal";

interface ReviewManagementClientProps {
  initialReviews: ReviewData[];
}

export function ReviewManagementClient({
  initialReviews,
}: ReviewManagementClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filteredReviews = useMemo(() => {
    let filtered = initialReviews;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (review) =>
          review.reviewer?.name?.toLowerCase().includes(query) ||
          review.reviewee?.name?.toLowerCase().includes(query) ||
          review.request?.title?.toLowerCase().includes(query) ||
          review.comment?.toLowerCase().includes(query) ||
          review.reviewer?.email?.toLowerCase().includes(query) ||
          review.reviewee?.email?.toLowerCase().includes(query)
      );
    }

    if (filterRating !== null) {
      filtered = filtered.filter((review) => Math.floor(review.rating) === filterRating);
    }

    return filtered;
  }, [initialReviews, searchQuery, filterRating]);

  const handleRowClick = (row: ReviewData) => {
    setSelectedReview(row);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRating(null);
  };

  const ratingOptions: number[] = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Review Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 font-medium">
            {filteredReviews.length} of {initialReviews.length} total reviews
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Search by reviewer, reviewee, request, or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border transition-all text-sm font-medium flex items-center gap-2 ${
              showFilters || filterRating !== null
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                : "bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {filterRating !== null && (
              <span className="ml-1 px-1.5 py-0.5 bg-indigo-600/40 rounded text-xs">
                {filterRating}★
              </span>
            )}
          </button>

          {(searchQuery || filterRating !== null) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl border border-zinc-900 bg-zinc-950/60 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1.5"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Rating:
          </span>
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterRating === rating
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-transparent"
              }`}
            >
              {rating}★
            </button>
          ))}
          {filterRating !== null && (
            <button
              onClick={() => setFilterRating(null)}
              className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="text-xs text-zinc-500">
        Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
        {searchQuery && ` matching "${searchQuery}"`}
        {filterRating !== null && ` with ${filterRating}★ rating`}
      </div>

      <ReusableTablePagination
        data={filteredReviews}
        columns={reviewColumns}
        pageSize={10}
        emptyMessage="No reviews match your search criteria."
        onRowClick={handleRowClick}
      />

      <ReviewDetailsModal
        review={selectedReview}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}