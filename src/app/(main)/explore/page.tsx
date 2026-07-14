import React from "react";
import { HelpRequestCard } from "@/components/shared/help-request-card";
import { ExploreFilters } from "@/components/pages/explore/explore-filters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { helpRequestService } from "../../../services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    area?: string;
    page?: string;
  }>;
}

interface BackendUser {
  _id?: string;
  name?: string;
  image?: string;
  avatarUrl?: string;
}

interface BackendHelpRequest {
  _id: string;
  title: string;
  location?: {
    type?: string;
    coordinates?: [number, number];
  };
  areaLabel: string;
  budget?: number;
  isPaid?: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  category: string;
  postedBy?: BackendUser | string;
  createdAt?: string;
}

interface ApiResponse {
  items?: BackendHelpRequest[];
  data?: {
    items?: BackendHelpRequest[];
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search?.toLowerCase() || "";
  const currentCategory = resolvedParams.category || "";
  const currentStatus = resolvedParams.status || "";
  const currentArea = resolvedParams.area || ""; 
  const currentPage = Math.max(Number(resolvedParams.page) || 1, 1);

  let rawRequests: BackendHelpRequest[] = [];
  try {
    const response = await helpRequestService.getHelpRequests() as ApiResponse;
    
    if (response && typeof response === "object") {
      if (Array.isArray(response.items)) {
        rawRequests = response.items;
      } else if (response.data && Array.isArray(response.data.items)) {
        rawRequests = response.data.items;
      } else if (Array.isArray(response)) {
        rawRequests = response as unknown as BackendHelpRequest[];
      }
    }
  } catch (error) {
    rawRequests = [];
  }

  const normalizedRequests = rawRequests.map((req) => {
    const resolvedLabel = req.areaLabel || "Unknown Area";
    
    let userId = "";
    let name = "Unknown User";
    let avatarUrl: string | undefined = undefined;

    if (req.postedBy && typeof req.postedBy === "object") {
      userId = req.postedBy._id || "";
      name = req.postedBy.name || "Unknown User";
      avatarUrl = req.postedBy.image || req.postedBy.avatarUrl;
    } else if (typeof req.postedBy === "string") {
      userId = req.postedBy;
    }

    const timeAgo = req.createdAt
      ? new Date(req.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Recently";

    return {
      _id: req._id,
      title: req.title || "",
      location: resolvedLabel,
      amount: req.budget || 0,
      isPaid: req.isPaid || false,
      status: req.status || "open",
      category: req.category || "",
      user: { _id: userId, name, avatarUrl, timeAgo },
    };
  });

  const filteredData = normalizedRequests.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery) ||
      item.location.toLowerCase().includes(searchQuery);
    const matchesCategory =
      !currentCategory || item.category === currentCategory;
    const matchesStatus = 
      !currentStatus || item.status.toLowerCase() === currentStatus.toLowerCase();
    const matchesArea =
      !currentArea ||
      item.location.toLowerCase().includes(currentArea.toLowerCase());
    return matchesSearch && matchesCategory && matchesStatus && matchesArea;
  });

  const ITEMS_PER_PAGE = 6;
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentCategory) params.set("category", currentCategory);
    if (currentStatus) params.set("status", currentStatus);
    if (currentArea) params.set("area", currentArea);
    params.set("page", pageNumber.toString());
    return `/explore?${params.toString()}`;
  };

  return (
    <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4 lg:px-0 space-y-10">
        <ExploreFilters />

        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Explore Requests {currentArea ? `near ${currentArea}` : ""}
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 font-medium">
            {totalItems} active {totalItems === 1 ? "request" : "requests"} looking for help
          </p>
        </div>

        {paginatedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {paginatedData.map((request) => (
              <HelpRequestCard
                key={request._id}
                _id={request._id}
                title={request.title}
                location={request.location}
                amount={request.amount}
                isPaid={request.isPaid}
                status={request.status}
                user={request.user}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-sm text-zinc-400 font-medium">
              No active requests match your description.
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Try resetting the dropdown filters.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="pt-8">
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious href={createPageUrl(currentPage - 1)} />
                ) : (
                  <span className="opacity-30 pointer-events-none flex items-center h-9 px-3.5 gap-1.5 rounded-xl border border-zinc-900 text-zinc-600 text-xs font-semibold">
                    <ChevronLeftIcon className="h-4 w-4" /> Previous
                  </span>
                )}
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={createPageUrl(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext href={createPageUrl(currentPage + 1)} />
                ) : (
                  <span className="opacity-30 pointer-events-none flex items-center h-9 px-3.5 gap-1.5 rounded-xl border border-zinc-900 text-zinc-600 text-xs font-semibold">
                    Next <ChevronRightIcon className="h-4 w-4" />
                  </span>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </main>
  );
}