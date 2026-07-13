"use client";

import React from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export default function DashboardNotification(): React.JSX.Element {
  const notifications = [
    { id: 1, text: "New message received", time: "2m ago" },
    { id: 2, text: "New urgent report submitted", time: "1h ago" },
    { id: 3, text: "A new user joined the platform", time: "3h ago" },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus:outline-none relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:border-zinc-800 transition-all active:scale-95 cursor-pointer group">
        <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-black animate-pulse" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl p-1.5 mt-2 shadow-2xl"
      >
        <div className="flex items-center justify-between px-2.5 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold text-white">
            Notifications
          </DropdownMenuLabel>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            {notifications.length} New
          </span>
        </div>

        <DropdownMenuSeparator className="bg-zinc-900 my-1" />

        <div className="max-h-[280px] overflow-y-auto space-y-0.5">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2.5 flex flex-col items-start gap-1 transition-colors duration-150"
              >
                <span className="text-xs font-medium leading-normal">
                  {notif.text}
                </span>
                <span className="text-[10px] text-zinc-550 font-normal">
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

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-zinc-900 my-1" />
            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-indigo-400 text-zinc-400 rounded-lg cursor-pointer p-2 text-xs font-semibold justify-center text-center transition-colors">
              Mark all as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}