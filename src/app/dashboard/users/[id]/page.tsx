// app/admin/users/[id]/page.tsx
import React from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Star, Calendar, CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Profile",
  description: "View your profile and manage your account settings.",
};
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  image?: string;
  avatarUrl?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  
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

  let user: UserProfile | null = null;
  let error: string | null = null;

  try {
    const response = await userService.getUserProfile(id);
    if (response && typeof response === "object") {
      user = response as UserProfile;
    }
  } catch (err) {
    error = "Failed to load user profile";
    console.error("Error fetching user:", err);
  }

  if (!user && !error) {
    notFound();
  }

  if (error || !user) {
    return (
      <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-zinc-950/40 border border-zinc-900 p-12 text-center">
            <p className="text-red-400">{error || "User not found"}</p>
            <Link href="/admin/users">
              <Button variant="outline" className="mt-4 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-zinc-600" />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4 ">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/users">
              <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
          </div>

          <Card className="bg-zinc-950/60 border-zinc-900 overflow-hidden">
            <CardHeader className="border-b border-zinc-900 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-zinc-800">
                    <AvatarImage src={user.image || user.avatarUrl} />
                    <AvatarFallback className="bg-zinc-900 text-zinc-400 text-2xl">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                      <Badge
                        className={`${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800"
                        } border px-2.5 py-0.5 text-xs font-medium rounded-full`}
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <p className="text-sm text-zinc-400">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-zinc-900 border-zinc-800 text-zinc-400">
                    ID: ThikAche-{user._id.slice(-8)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Location
                      </p>
                    </div>
                    <p className="text-sm text-zinc-300">
                      {user.area || "Not specified"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-emerald-400" />
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Joined
                      </p>
                    </div>
                    <p className="text-sm text-zinc-300">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-amber-400" />
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Rating
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-amber-400">
                        {user.avgRating ? user.avgRating.toFixed(1) : "N/A"}
                      </span>
                      {user.avgRating && (
                        <div className="flex flex-col gap-0.5">
                          {renderStars(user.avgRating)}
                          <span className="text-xs text-zinc-500">
                            {user.completedCount || 0} reviews
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Tasks Completed
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {user.completedCount || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-zinc-900/20 border border-zinc-900">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  User ID
                </p>
                <p className="text-xs text-zinc-600 font-mono break-all">
                  {user._id}
                </p>
              </div>

              
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}