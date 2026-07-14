"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Trash2, CheckCircle2, Ban, MoreVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { helpRequestService } from "@/services/help-request.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HelpRequestCardProps {
  _id: string;
  title: string;
  shortDescription: string;
  location: string;
  amount: number;
  isPaid: boolean;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  preferredTime?: string;
  user: {
    _id: string;
    name: string;
    avatarUrl?: string;
    timeAgo: string;
  };
  currentUserId?: string;
}

export function HelpRequestCard({
  _id,
  title,
  shortDescription,
  location,
  amount,
  isPaid,
  status,
  preferredTime,
  user,
  currentUserId,
}: HelpRequestCardProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isOwner = currentUserId === user._id;

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const handleStatusChange = async (action: "complete" | "cancel" | "delete") => {
    setIsPending(true);
    try {
      if (action === "delete") {
        if (!confirm("Are you sure you want to delete this help request?")) return;
        await helpRequestService.deleteHelpRequest(_id);
        toast.success("Request deleted successfully");
      } else if (action === "complete") {
        await helpRequestService.markComplete(_id);
        toast.success("Request marked as completed");
      } else if (action === "cancel") {
        await helpRequestService.cancelHelpRequest(_id);
        toast.success("Request cancelled successfully");
      }
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setIsPending(false);
    }
  };

  const getStatusColor = (statusStr: string) => {
    switch (statusStr) {
      case "open":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "matched":
      case "in_progress":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "completed":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 p-5 transition-all duration-200 shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${getStatusColor(status)}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status === "open" ? "bg-emerald-400 animate-pulse" : "bg-current"}`} />
              {status.toUpperCase().replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{user.timeAgo}</span>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={isPending}
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl p-1.5 min-w-44 shadow-xl">
                  {/* ওনার নিজে স্টার্ট করতে পারবে না, কিন্তু কাজ রানিং থাকলে কমপ্লিট করতে পারবে */}
                  {(status === "in_progress" || status === "matched") && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("complete")}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium hover:bg-zinc-900 focus:bg-zinc-900 focus:text-zinc-100 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mark Completed
                    </DropdownMenuItem>
                  )}
                  
                  {status !== "completed" && status !== "cancelled" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("cancel")}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium hover:bg-zinc-900 focus:bg-zinc-900 focus:text-zinc-100 transition-colors"
                      >
                        <Ban className="h-4 w-4 text-zinc-400" /> Cancel Request
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-zinc-900 my-1" />
                    </>
                  )}
                  
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("delete")}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 focus:text-rose-300 focus:bg-rose-950/20 cursor-pointer text-sm font-medium transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Request
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg text-zinc-100 tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2 text-xs text-zinc-500 border-t border-zinc-900">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-zinc-600" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {preferredTime && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-zinc-600" />
              <span>{new Date(preferredTime).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
            ) : (
              <span className="text-xs font-semibold text-zinc-300">
                {mounted ? userInitial : ""}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-300 leading-tight">
              {mounted ? user.name : "Loading..."}
            </span>
            <span className="text-[10px] text-zinc-500">Requester</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-500 block leading-none mb-1">Budget</span>
          <span className="text-base font-extrabold text-indigo-400">
            {isPaid ? `৳${amount}` : "Free"}
          </span>
        </div>
      </div>
    </div>
  );
}