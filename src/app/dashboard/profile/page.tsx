// app/dashboard/profile/page.tsx
import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import type { Metadata } from "next";
import { ProfileClient } from "../../../components/pages/dashboard/profile/profile-client";

export const metadata: Metadata = {
  title: "My Profile | ThikAche",
  description: "Manage your profile settings and personal information",
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  phoneNumber?: string;
  district?: string;
  upazila?: string;
  bloodGroup?: string;
  createdAt?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
}

export default async function ProfilePage() {
  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });
  const user = session?.user as UserProfile | undefined;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-zinc-500">Please login to view profile</p>
      </div>
    );
  }

  return <ProfileClient user={user} />;
}