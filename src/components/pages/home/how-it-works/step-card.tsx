import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

export function StepCard({ icon: Icon, title, description, iconClassName }: StepCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm transition-all duration-300 hover:border-zinc-800">
      <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl border border-zinc-900 bg-zinc-950 shrink-0", iconClassName)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-base font-semibold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
}