// components/pages/dashboard/requests/my-requests-client.tsx (Client Component)
"use client";

import React, { useState } from "react";
import { HelpRequestCard } from "@/components/shared/help-request-card";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HelpRequest } from "@/app/dashboard/requests/page";

interface MyRequestsClientProps {
  initialRequests: HelpRequest[];
  errorMsg: string;
}

const statusPriority: Record<string, number> = {
  matched: 0,
  in_progress: 1,
  open: 2,
  completed: 3,
  cancelled: 4,
};

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const elapsed = now.getTime() - past.getTime();
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  if (elapsed < msPerMinute) return "Just now";
  if (elapsed < msPerHour) return `${Math.round(elapsed / msPerMinute)}m ago`;
  if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)}h ago`;
  return `${Math.round(elapsed / msPerDay)}d ago`;
}

export function MyRequestsClient({ initialRequests, errorMsg }: MyRequestsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const sortedRequests = [...initialRequests].sort((a, b) => {
    const statusA = statusPriority[a.status] ?? 99;
    const statusB = statusPriority[b.status] ?? 99;
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalItems = sortedRequests.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">My Posted Requests</h1>
        <p className="text-sm text-zinc-400">
          {totalItems} {totalItems === 1 ? "request" : "requests"} in total
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-950/40 bg-red-950/10 text-red-400 text-sm mb-6">
          {errorMsg}
        </div>
      )}

      {sortedRequests.length === 0 && !errorMsg ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl h-60 bg-zinc-950/20 text-center p-6">
          <p className="text-zinc-400 text-sm font-medium mb-1">No requests found</p>
          <p className="text-zinc-500 text-xs">You haven&apos;t created any help requests yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedRequests.map((request) => {
              const userData = typeof request.postedBy === "object" ? request.postedBy : null;
              const requesterId = userData?._id || (typeof request.postedBy === "string" ? request.postedBy : "");

              return (
                <HelpRequestCard
                  key={request._id}
                  _id={request._id}
                  title={request.title}
                  shortDescription={request.shortDescription}
                  location={request.areaLabel}
                  amount={request.budget || 0}
                  isPaid={request.isPaid}
                  status={request.status}
                  preferredTime={request.preferredTime}
                  user={{
                    _id: requesterId,
                    name: userData?.name || "User",
                    avatarUrl: userData?.image,
                    timeAgo: formatTimeAgo(request.createdAt),
                  }}
                  currentUserId={requesterId}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={`text-2xs rounded-xl border-zinc-900 transition-all ${
                        currentPage === 1
                          ? "pointer-events-none opacity-40 bg-transparent text-zinc-600"
                          : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={isActive}
                          className={`text-2xs h-9 w-9 rounded-xl border transition-all ${
                            isActive
                              ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500"
                              : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 10 && (
                    <PaginationItem>
                      <span className="text-zinc-500 text-xs px-2">...</span>
                    </PaginationItem>
                  )}

                  {totalPages > 10 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                        className="text-2xs h-9 w-9 rounded-xl border bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={`text-2xs rounded-xl border-zinc-900 transition-all ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-40 bg-transparent text-zinc-600"
                          : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}