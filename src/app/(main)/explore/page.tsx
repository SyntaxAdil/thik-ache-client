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
import { ChevronLeftIcon, ChevronRightIcon, Phone, Mail, MapPin, Clock } from "lucide-react";
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

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 text-2xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Help Requests
            </span>
            <span className="text-2xs font-semibold text-zinc-600">
              {currentArea ? `Near ${currentArea}` : "All Areas"}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Explore Requests {currentArea ? `near ${currentArea}` : ""}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              {totalItems} active {totalItems === 1 ? "request" : "requests"} looking for help
            </p>
          </div>
          <hr className="border-zinc-900 w-16 border-t-2 pt-2" />
        </div>

        <ExploreFilters />

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

        <section className="pt-10 border-t border-zinc-900/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Phone className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Need Help?</h3>
                <p className="text-xs text-zinc-500">Contact our support team for assistance</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="tel:+8801234567890"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-indigo-400" />
                +880 1234 567890
              </a>
              <a
                href="mailto:support@thikache.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-indigo-400" />
                support@thikache.com
              </a>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/30 border border-zinc-800/50 text-xs text-zinc-500">
                <Clock className="h-4 w-4 text-zinc-600" />
                Available 24/7
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}