"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { helpRequestService } from "@/services/help-request.service";
import { reviewService } from "@/services/review.service";
import { userService } from "@/services/user.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface HelpRequestItem {
  _id: string;
  title: string;
  status: string;
  areaLabel: string;
  category: string;
  isPaid: boolean;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewItem {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  reviewer: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  reviewee: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
}

interface NotificationItem {
  id: string;
  text: string;
  time: string;
}

interface DashboardNotificationProps {
  userRole: "user" | "admin";
}

interface HelpRequestsResponse {
  items?: HelpRequestItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function DashboardNotification({ userRole }: DashboardNotificationProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkNotifications = async () => {
      setIsLoading(true);
      const freshNotifs: NotificationItem[] = [];

      try {
        if (userRole === "user") {
          const myRequests = await helpRequestService.getMyPostedRequests();
          if (Array.isArray(myRequests)) {
            (myRequests as HelpRequestItem[]).forEach((req: HelpRequestItem) => {
              if (req.status === "in_progress" || req.status === "completed") {
                freshNotifs.push({
                  id: req._id,
                  text: `Status Update: Your request "${req.title}" is now ${req.status}.`,
                  time: new Date().toLocaleTimeString(),
                });
              }
            });
          }

          const allRequests = await helpRequestService.getHelpRequests({ limit: 5 });
          let requests: HelpRequestItem[] = [];
          if (allRequests && typeof allRequests === "object") {
            if ("items" in allRequests && Array.isArray(allRequests.items)) {
              requests = allRequests.items as HelpRequestItem[];
            } else if (Array.isArray(allRequests)) {
              requests = allRequests as HelpRequestItem[];
            } else if ("data" in allRequests && Array.isArray(allRequests.data)) {
              requests = allRequests.data as HelpRequestItem[];
            }
          }

          requests.slice(0, 3).forEach((req: HelpRequestItem) => {
            freshNotifs.push({
              id: `new-${req._id}`,
              text: `New Opportunity: "${req.title}" has been posted in your area.`,
              time: new Date().toLocaleTimeString(),
            });
          });
        }

        if (userRole === "admin") {
          const allUsers = await userService.getAllUsers();
          if (Array.isArray(allUsers) && allUsers.length > 0) {
            const userArray = allUsers as unknown as UserItem[];
            userArray.slice(-3).forEach((user: UserItem) => {
              freshNotifs.push({
                id: `user-${user._id}`,
                text: `System Alert: New user "${user.name}" joined the platform.`,
                time: new Date().toLocaleTimeString(),
              });
            });
          }

          const reviews = await reviewService.getRecentReviews(3);
          if (Array.isArray(reviews) && reviews.length > 0) {
            (reviews as ReviewItem[]).forEach((rev: ReviewItem) => {
              freshNotifs.push({
                id: `rev-${rev._id}`,
                text: `Admin Alert: A new ${rev.rating}-star review was submitted.`,
                time: new Date().toLocaleTimeString(),
              });
            });
          }
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }

      setNotifications(freshNotifs);
      setIsLoading(false);
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [userRole]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus:outline-none relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:border-zinc-800 transition-all active:scale-95 cursor-pointer group">
        <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-black animate-pulse" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl p-1.5 mt-2 shadow-2xl"
      >
        <div className="flex items-center justify-between px-2.5 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-white">
            Notifications
          </DropdownMenuLabel>
          {!isLoading && notifications.length > 0 && (
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>

        <DropdownMenuSeparator className="bg-zinc-900 my-1" />

        <div className="max-h-[280px] overflow-y-auto space-y-0.5">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif: NotificationItem) => (
              <DropdownMenuItem
                key={notif.id}
                className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2.5 flex flex-col items-start gap-1 transition-colors duration-150 hover:bg-zinc-900/50"
              >
                <span className="text-xs font-medium leading-normal text-zinc-200">
                  {notif.text}
                </span>
                <span className="text-[10px] text-zinc-500 font-normal">
                  {notif.time}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-zinc-500 font-medium">
              No new notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}