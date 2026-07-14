"use client";

import React, { useState } from "react";
import { MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { helpRequestService } from "@/services/help-request.service";

interface HelpApproachButtonProps {
  requestId: string;
  posterId: string;
  currentUserId?: string;
  status: string;
}

export function HelpApproachButton({
  requestId,
  posterId,
  currentUserId,
  status,
}: HelpApproachButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [approached, setApproached] = useState(false);

  const isOwner = currentUserId === posterId;
  const isAvailable = status.toLowerCase() === "open";

  const handleApproach = async () => {
    if (!currentUserId) {
      toast.error("Please log in to offer help.");
      return;
    }

    setIsPending(true);
    try {
      
      await helpRequestService.acceptHelpRequest(requestId);
      setApproached(true);
      toast.success("Your offer to help has been sent to the requester!");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send help request");
    } finally {
      setIsPending(false);
    }
  };

  if (isOwner) {
    return (
      <button
        disabled
        className="w-full py-3.5 px-4 rounded-xl bg-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-widest border border-zinc-900 cursor-not-allowed flex items-center justify-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        You Posted This Request
      </button>
    );
  }

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 text-zinc-600 border border-zinc-950 font-bold text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
      >
        Request is {status.toUpperCase()}
      </button>
    );
  }

  return (
    <button
      onClick={handleApproach}
      disabled={isPending || approached}
      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
        approached
          ? "bg-emerald-600 text-white"
          : "bg-primary hover:opacity-90 text-primary-foreground cursor-pointer"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : approached ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <MessageSquare className="h-4 w-4" />
      )}
      {isPending ? "Sending Request..." : approached ? "Offered successfully" : "I Can Help"}
    </button>
  );
}