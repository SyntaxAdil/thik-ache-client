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

  // 1. Declare the utility function BEFORE using it in useEffect
  const updateUrlParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/explore?${params.toString()}`);
  };

  // 2. Run the hook safely now that the function is defined
  useEffect(() => {
    updateUrlParam("search", debouncedSearch);
  }, [debouncedSearch]);

  const clearAllFilters = () => {
    setSearchVal("");
    router.push("/explore?area=Dhanmondi&sort=newest");
  };

  const hasActiveFilters = currentSearch || currentCategory || currentStatus || currentArea !== "Dhanmondi";

  return (
    <div className="w-full space-y-5 select-none">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between w-full">
        {/* Search Input */}
        <div className="relative w-full md:flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors" />
          <input
            type="text"
            placeholder={`Search requests in ${currentArea}...`}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-950 border border-zinc-900 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-800 focus:bg-zinc-900/20 transition-all"
          />
        </div>

        {/* Filters Dropdowns Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category */}
          <Select value={currentCategory} onValueChange={(val) => updateUrlParam("category", val)}>
            <SelectTrigger className="w-[120px] h-10 bg-zinc-950 border-zinc-900 text-zinc-400 rounded-xl text-xs focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="tech">Tech Support</SelectItem>
            </SelectContent>
          </Select>

          {/* Area */}
          <Select value={currentArea} onValueChange={(val) => updateUrlParam("area", val)}>
            <SelectTrigger className="w-[110px] h-10 bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl text-xs focus:ring-0">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
              <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
              <SelectItem value="Mirpur">Mirpur</SelectItem>
              <SelectItem value="Banani">Banani</SelectItem>
              <SelectItem value="Lalmatia">Lalmatia</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={currentStatus} onValueChange={(val) => updateUrlParam("status", val)}>
            <SelectTrigger className="w-[110px] h-10 bg-zinc-950 border-zinc-900 text-zinc-400 rounded-xl text-xs focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">Matched</SelectItem>
              <SelectItem value="CLOSED">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={currentSort} onValueChange={(val) => updateUrlParam("sort", val)}>
            <SelectTrigger className="w-[100px] h-10 bg-zinc-950 border-zinc-900 text-zinc-400 rounded-xl text-xs focus:ring-0">
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="reward">High Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => updateUrlParam("area", "Dhanmondi")}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 group hover:border-zinc-700 transition-colors"
          >
            <span>{currentArea}</span>
            <X className="h-3 w-3 text-zinc-500 group-hover:text-zinc-300" />
          </button>

          {currentStatus && (
            <button
              onClick={() => updateUrlParam("status", null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/20 border border-red-900/30 text-xs text-red-400 group hover:bg-red-950/40 transition-colors"
            >
              <span>{currentStatus === "IN_PROGRESS" ? "Matched" : currentStatus}</span>
              <X className="h-3 w-3 text-red-500/70 group-hover:text-red-400" />
            </button>
          )}

          {currentCategory && (
            <button
              onClick={() => updateUrlParam("category", null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/20 border border-amber-900/30 text-xs text-amber-400 group hover:bg-amber-950/40 transition-colors"
            >
              <span className="capitalize">{currentCategory}</span>
              <X className="h-3 w-3 text-amber-500/70 group-hover:text-amber-400" />
            </button>
          )}

          {currentSearch && (
            <button
              onClick={() => { updateUrlParam("search", null); setSearchVal(""); }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-400 group hover:bg-indigo-950/40 transition-colors"
            >
              <span>Query: &quot;{currentSearch}&quot;</span>
              <X className="h-3 w-3 text-indigo-500/70 group-hover:text-indigo-400" />
            </button>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300 ml-1 transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}