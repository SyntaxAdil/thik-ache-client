import React from "react";
import { HelpRequestCard } from "@/components/shared/help-request-card";
import { ExploreFilters } from "@/components/pages/explore/explore-filters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const MOCK_DATA = [
  {
    _id: "1",
    title: "Need help fixing leaking water heater at Road 12A",
    location: "Road 12A, Dhanmondi",
    amount: 450,
    status: "OPEN" as const,
    category: "plumbing",
    user: { name: "Rahman H.", timeAgo: "15m ago" },
  },
  {
    _id: "2",
    title: "Urgent: Grocery pickup from Meena Bazar",
    location: "Siddeshwari, Dhanmondi",
    amount: 200,
    status: "OPEN" as const,
    category: "delivery",
    user: { name: "Zakiya Begum", timeAgo: "2h ago" },
  },
  {
    _id: "3",
    title: "Need someone to walk my dog in Dhanmondi Lake",
    location: "Dhanmondi 32",
    amount: 350,
    status: "IN_PROGRESS" as const,
    category: "delivery",
    user: { name: "Capt. Ahmed", timeAgo: "4h ago" },
  },
  {
    _id: "4",
    title: "Emergency router configuration & local WiFi setup",
    location: "Satmasjid Road, Dhanmondi",
    amount: 600,
    status: "OPEN" as const,
    category: "tech",
    user: { name: "Adnan Sami", timeAgo: "5h ago" },
  },
  {
    _id: "5",
    title: "Looking for medicine delivery from Lazz Pharma",
    location: "Kalabagan High Road",
    amount: 150,
    status: "CLOSED" as const,
    category: "delivery",
    user: { name: "Sabina Yasmin", timeAgo: "1d ago" },
  },
  {
    _id: "6",
    title: "Home delivery package handling & fragile dropoff",
    location: "Dhanmondi 8/A",
    amount: 250,
    status: "OPEN" as const,
    category: "delivery",
    user: { name: "Rakib Hossain", timeAgo: "1d ago" },
  },
  {
    _id: "7",
    title: "Need help moving dining room table to 3rd floor",
    location: "Zigatola Corner",
    amount: 500,
    status: "OPEN" as const,
    category: "delivery",
    user: { name: "Tanvir Ahmed", timeAgo: "2d ago" },
  },
];

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    area?: string;
    page?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search?.toLowerCase() || "";
  const currentCategory = resolvedParams.category || "";
  const currentStatus = resolvedParams.status || "";
  const currentArea = resolvedParams.area || "Dhanmondi";
  const currentPage = Math.max(Number(resolvedParams.page) || 1, 1);

  const filteredData = MOCK_DATA.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery) ||
      item.location.toLowerCase().includes(searchQuery);
    const matchesCategory =
      !currentCategory || item.category === currentCategory;
    const matchesStatus = !currentStatus || item.status === currentStatus;
    const matchesArea =
      !currentArea ||
      item.location.toLowerCase().includes(currentArea.toLowerCase());
    return matchesSearch && matchesCategory && matchesStatus && matchesArea;
  });

  const ITEMS_PER_PAGE = 3;
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
    params.set("area", currentArea);
    params.set("page", pageNumber.toString());
    return `/explore?${params.toString()}`;
  };

  return (
    <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4  lg:px-0 space-y-10">
        <ExploreFilters />

        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Explore Requests near {currentArea}
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 font-medium">
            {totalItems} active {totalItems === 1 ? "request" : "requests"}{" "}
            looking for help
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
