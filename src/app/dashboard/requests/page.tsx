import React from "react";
import { helpRequestService } from "@/services/help-request.service";
import { HelpRequestCard } from "../../../components/shared/help-request-card";

type RequestStatus = "open" | "matched" | "in_progress" | "completed" | "cancelled";
type RequestCategory = "tech" | "tutoring" | "errand" | "moving" | "repair" | "other";

interface UserSummary {
  _id: string;
  name: string;
  image?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
}

interface HelpRequest {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: RequestCategory;
  location: { type: "Point"; coordinates: [number, number] };
  areaLabel: string;
  budget?: number;
  isPaid: boolean;
  preferredTime?: string;
  imageUrl?: string;
  status: RequestStatus;
  postedBy: string | UserSummary;
  helper?: string | UserSummary;
  createdAt: string;
  updatedAt: string;
}

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

export default async function MyRequests() {
  let requests: HelpRequest[] = [];
  let errorMsg = "";

  try {
    const data = await helpRequestService.getMyPostedRequests();
    requests = data as HelpRequest[];
  } catch (error: unknown) {
    errorMsg = error instanceof Error ? error.message : "Failed to load your requests.";
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">My Posted Requests</h1>
        <p className="text-sm text-zinc-400">Manage and track all the help requests you have created.</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-950/40 bg-red-950/10 text-red-400 text-sm mb-6">
          {errorMsg}
        </div>
      )}

      {requests.length === 0 && !errorMsg ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl h-60 bg-zinc-950/20 text-center p-6">
          <p className="text-zinc-400 text-sm font-medium mb-1">No requests found</p>
          <p className="text-zinc-500 text-xs">You haven&apos;t created any help requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((request) => {
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
      )}
    </div>
  );
}