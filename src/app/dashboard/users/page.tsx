// app/admin/users/page.tsx
import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { userService } from "@/services/user.service";
import { UserData } from "../../../components/pages/dashboard/user/user-columns";
import { UserManagementClient } from "../../../components/pages/dashboard/user/user-management-client";


export default async function UserManagementPage() {
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

  let users: UserData[] = [];

  try {
    const response = await userService.getAllUsers();
    if (Array.isArray(response)) {
      users = response as UserData[];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <main className="min-h-screen w-full bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4">
        <UserManagementClient initialUsers={users} currentUserId={session.user.id} />
      </div>
    </main>
  );
}