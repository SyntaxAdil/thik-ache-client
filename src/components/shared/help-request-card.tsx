"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Trash2, CheckCircle2, Ban, MoreVertical, Eye } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { helpRequestService } from "@/services/help-request.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import Link from "next/link";
import { ReviewDialog } from "../review-dialog";


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
  const [isReviewOpen, setIsReviewOpen] = useState(false);
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
        setIsReviewOpen(true);
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

  return (
    <>
      <div className={`group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all ${related ? "opacity-95" : ""} hover:-translate-y-1.25 transition-all duration-200`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${getStatusColor(status)}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status === "open" ? "bg-emerald-400 animate-pulse" : "bg-current"}`} />
              {status.toUpperCase().replace("_", " ")}
            </span>

            <div className="flex items-center gap-2">
              <Link href={`/explore/${_id}`} className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-primary transition-colors">
                <Eye className="h-4 w-4" /> View
              </Link>
              {isOwner && !related && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {(status === "in_progress" || status === "matched") && (
                      <DropdownMenuItem onClick={() => handleStatusChange("complete")}>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mark Completed
                      </DropdownMenuItem>
                    )}
                    {status !== "completed" && status !== "cancelled" && (
                      <DropdownMenuItem onClick={() => handleStatusChange("cancel")}>
                        <Ban className="h-4 w-4 text-zinc-400" /> Cancel Request
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange("delete")} variant="destructive">
                      <Trash2 className="h-4 w-4" /> Delete Request
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-zinc-100 line-clamp-1">{title}</h3>
            {shortDescription && <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">{shortDescription}</p>}
          </div>

          <div className="flex flex-col gap-2 pt-2 text-xs text-zinc-500 border-t border-zinc-900/50">
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {location}</div>
            {preferredTime && <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {new Date(preferredTime).toLocaleDateString()}</div>}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-900/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold">
              {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="object-cover" /> : (mounted ? user.name.charAt(0).toUpperCase() : "")}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-300 leading-none">{mounted ? user.name : "..."}</span>
              <span className="text-[10px] text-zinc-500 mt-1">Requester</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block leading-none mb-1 uppercase tracking-wider">Budget</span>
            <span className="text-sm font-extrabold text-indigo-400">{isPaid ? `৳${amount}` : "Free"}</span>
          </div>
        </div>
      </div>

      <ReviewDialog 
        open={isReviewOpen} 
        onOpenChange={setIsReviewOpen} 
        requestId={_id} 
        revieweeId={user._id} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-950 border border-zinc-900 text-zinc-100 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500">This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 border-zinc-800">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-rose-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}