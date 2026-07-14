"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Trash2, CheckCircle2, Ban, MoreVertical, Loader2, ArrowRight } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HelpRequestCardProps {
  _id: string;
  title: string;
  shortDescription?: string;
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
  related?: boolean;
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
  related = false,
}: HelpRequestCardProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isOwner = currentUserId === user._id;

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const handleStatusChange = async (action: "complete" | "cancel" | "delete") => {
    if (action === "delete") {
      setIsDeleteDialogOpen(true);
      return;
    }

    setIsPending(true);
    try {
      if (action === "complete") {
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

  const handleDeleteConfirm = async () => {
    setIsDeleteDialogOpen(false);
    setIsPending(true);
    try {
      await helpRequestService.deleteHelpRequest(_id);
      toast.success("Request deleted successfully");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Deletion failed");
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

  const handleNavigateToDetails = () => {
    router.push(`/explore/${_id}`);
  };

  return (
    <>
      <div 
        onClick={handleNavigateToDetails}
        className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 p-5 transition-all duration-200 shadow-md cursor-pointer ${related ? "opacity-95 hover:opacity-100" : ""}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${getStatusColor(status)}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status === "open" ? "bg-emerald-400 animate-pulse" : "bg-current"}`} />
                {status.toUpperCase().replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">{user.timeAgo}</span>
              {isOwner && !related && (
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
            {shortDescription && (
              <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                {shortDescription}
              </p>
            )}
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

        <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
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
              <span className="text-xs font-semibold text-zinc-300 leading-none">
                {mounted ? user.name : "Loading..."}
              </span>
              <span className="text-[10px] text-zinc-500 mt-1">Requester</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block leading-none mb-1">Budget</span>
              <span className="text-sm font-extrabold text-indigo-400">
                {isPaid ? `৳${amount}` : "Free"}
              </span>
            </div>
            
            <button className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-primary transition-all group/btn shadow-inner">
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-900 text-zinc-100 rounded-2xl max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-zinc-200">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-zinc-500">
              This action cannot be undone. This will permanently delete your help request from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-zinc-100 rounded-xl px-4 py-2 text-sm font-medium transition-colors cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
            >
              Delete Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}