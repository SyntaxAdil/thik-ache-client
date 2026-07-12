"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface HelpRequestCardProps {
  _id: string;
  title: string;
  location: string;
  amount: number;
  status: "OPEN" | "CLOSED" | "IN_PROGRESS";
  user: {
    name: string;
    avatarUrl?: string;
    timeAgo: string;
  };
}

export function HelpRequestCard({
  title,
  location,
  amount,
  status,
  user,
  _id,
}: HelpRequestCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "CLOSED":
        return {
          text: "Completed",
          bg: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400",
          dot: "bg-emerald-500",
        };
      case "IN_PROGRESS":
        return {
          text: "Matched",
          bg: "bg-amber-950/30 border-amber-900/50 text-amber-400",
          dot: "bg-amber-500",
        };
      default:
        return {
          text: "Open",
          bg: "bg-zinc-900 border-zinc-800 text-zinc-300",
          dot: "bg-indigo-500",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const initial = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="group w-full border-zinc-900 bg-zinc-950 text-zinc-100 shadow-xl transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/40 hover:-translate-y-1 flex flex-col justify-between h-[230px] p-5 select-none">
      <CardContent className="p-0 flex flex-col gap-4 h-full justify-between">
        <div className="flex items-center justify-between w-full">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.text}
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {user.timeAgo}
          </span>
        </div>

        <h3 className="text-base font-semibold tracking-tight text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors duration-300">
          {title}
        </h3>

        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={40}
                height={40}
                className="h-full w-full rounded-full object-cover bg-zinc-900"
              />
            ) : null}
            <span className="text-xs font-bold text-zinc-500 absolute">
              {initial}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-300 truncate group-hover:text-zinc-200 transition-colors duration-300">
              {user.name}
            </span>
            <span className="text-xs text-zinc-500 truncate">{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-900/80 w-full mt-auto">
          <span className="text-sm font-bold text-indigo-400 tracking-tight">
            ৳{amount}
          </span>
          <Link href={`/requests/${_id}`} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}