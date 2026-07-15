// app/admin/reviews/page.tsx
import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { reviewService } from "@/services/review.service";
import { ReviewData } from "../../../components/pages/dashboard/review/review-columns";
import { ReviewManagementClient } from "../../../components/pages/dashboard/review/review-management-client";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Review Management",
  description: "Manage all the reviews and feedbacks.",
};
export default async function ReviewManagementPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 p-12 text-center">
            <p className="text-zinc-400">Please login to access admin panel</p>
          </div>
        </div>
      </main>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 p-12 text-center">
            <p className="text-zinc-400">Access denied. Admin only.</p>
          </div>
        </div>
      </main>
    );
  }

  let reviews: ReviewData[] = [];

  try {
    const response = await reviewService.getAllReviews();
    if (Array.isArray(response)) {
      reviews = response as ReviewData[];
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4">
        <ReviewManagementClient initialReviews={reviews} />
      </div>
    </main>
  );
}