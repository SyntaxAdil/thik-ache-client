"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CATEGORIES = [
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
  { label: "Carpentry", value: "carpentry" },
  { label: "Painting", value: "painting" },
  { label: "Cleaning", value: "cleaning" },
  { label: "Tech Support", value: "tech_support" },
  { label: "Web Development", value: "web_dev" },
  { label: "Graphics Design", value: "graphics_design" },
  { label: "Data Entry", value: "data_entry" },
  { label: "Delivery", value: "delivery" },
  { label: "Grocery Shopping", value: "grocery_shopping" },
  { label: "Moving Help", value: "moving_help" },
  { label: "Tutoring", value: "tutoring" },
  { label: "Language Translation", value: "language_translation" },
  { label: "Pet Care", value: "pet_care" },
  { label: "Medical Escort", value: "medical_escort" },
  { label: "Fitness Coaching", value: "fitness_coaching" },
  { label: "Other", value: "other" },
];

import { DHAKA_AREAS } from "@/assets/dhaka-top-areas";

export function ExploreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentArea = searchParams.get("area") || "Dhanmondi";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [searchVal, setSearchVal] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchVal, 300);

  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/explore?${params.toString()}`);
  };

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
      router.push(`/explore?${params.toString()}`);
    }
  }, [debouncedSearch]);

  const clearAllFilters = () => {
    setSearchVal("");
    router.push("/explore?area=Dhanmondi&sort=newest");
  };

  const hasActiveFilters =
    currentSearch ||
    currentCategory ||
    currentStatus ||
    currentArea !== "Dhanmondi" ||
    currentSort !== "newest";

  return (
    <div className="w-full space-y-5 select-none">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between w-full">
        <div className="relative w-full md:flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search for help requests in ${currentArea}...`}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-900 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={currentCategory || "all"}
            onValueChange={(val) => updateUrlParam("category", val)}
          >
            <SelectTrigger className="w-[130px] h-10 bg-zinc-950 border-zinc-900 text-zinc-400 rounded-xl text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentArea || "Dhanmondi"}
            onValueChange={(val) => updateUrlParam("area", val)}
          >
            <SelectTrigger className="w-[120px] h-10 bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl text-xs">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900">
              {DHAKA_AREAS.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentStatus || "all"}
            onValueChange={(val) => updateUrlParam("status", val)}
          >
            <SelectTrigger className="w-[110px] h-10 bg-zinc-950 border-zinc-900 text-zinc-400 rounded-xl text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentSort || "newest"}
            onValueChange={(val) => updateUrlParam("sort", val)}
          >
            <SelectTrigger className="w-[110px] h-10 bg-zinc-950 border-zinc-900 text-zinc-400 rounded-xl text-xs">
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
          
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {currentArea && currentArea !== "Dhanmondi" && (
            <button
              onClick={() => updateUrlParam("area", "Dhanmondi")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
            >
              {currentArea} <X className="h-3 w-3" />
            </button>
          )}
          {currentStatus && (
            <button
              onClick={() => updateUrlParam("status", null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 capitalize"
            >
              {currentStatus.replace("_", " ")} <X className="h-3 w-3" />
            </button>
          )}
          {currentCategory && (
            <button
              onClick={() => updateUrlParam("category", null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
            >
              {CATEGORIES.find((c) => c.value === currentCategory)?.label ||
                currentCategory}{" "}
              <X className="h-3 w-3" />
            </button>
          )}
          {currentSearch && (
            <button
              onClick={() => {
                setSearchVal("");
                updateUrlParam("search", null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
            >
              &quot;{currentSearch}&quot; <X className="h-3 w-3" />
            </button>
          )}
          {currentSort !== "newest" && (
            <button
              onClick={() => updateUrlParam("sort", "newest")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
            >
              Sort: {currentSort.replace("_", " ")} <X className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300 ml-1 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}