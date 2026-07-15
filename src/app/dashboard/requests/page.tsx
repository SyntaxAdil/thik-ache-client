// app/dashboard/requests/page.tsx (Server Component)
import React from "react";
import { headers } from "next/headers";
import { helpRequestService } from "@/services/help-request.service";
import { auth } from "@/lib/auth/auth";
import { MyRequestsClient } from "@/components/pages/dashboard/requests/my-requests-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests",
  description: "Manage and track all the help requests you have created.",
};

type RequestStatus = "open" | "matched" | "in_progress" | "completed" | "cancelled";

interface UserSummary {
  _id: string;
  name: string;
  image?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
}

export interface HelpRequest {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
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

export default async function MyRequests() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 p-12 text-center">
            <p className="text-zinc-400">Please login to view your requests</p>
          </div>
        </div>
      </main>
    );
  }

  let requests: HelpRequest[] = [];
  let errorMsg = "";

  try {
    const data = await helpRequestService.getMyPostedRequests();
    if (Array.isArray(data)) {
      requests = data as HelpRequest[];
    }
  } catch (error: unknown) {
    errorMsg = error instanceof Error ? error.message : "Failed to load your requests.";
  }

  return <MyRequestsClient initialRequests={requests} errorMsg={errorMsg} />;
}