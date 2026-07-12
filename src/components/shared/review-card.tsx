"use client";

import React from "react";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { MagicCard } from "../ui/magic-card";
import Image from "next/image";

export type ReviewDirection = "requester_to_helper" | "helper_to_requester";

interface ReviewCardProps {
  rating: number;
  comment: string;
  direction: ReviewDirection;
  reviewer: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

// Stagger animation container variants
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

export function ReviewCard({ rating, comment, reviewer }: ReviewCardProps) {
  const { theme } = useTheme();

  const initial = reviewer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <MagicCard
      gradientColor={theme === "dark" ? "#121214" : "#E4E4E740"}
      className="w-full border border-zinc-900 bg-black text-zinc-100 shadow-2xl transition-all duration-300 hover:border-zinc-800 h-[240px] rounded-xl overflow-hidden group"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="flex flex-col justify-between h-full w-full p-6 select-none bg-transparent box-border"
      >
        {/* Top Segment: Star Ratings */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-0.5 shrink-0"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110`}
              style={{
                transitionDelay: `${i * 30}ms`,
                fill: i < rating ? "#f59e0b" : "transparent",
                color: i < rating ? "#f59e0b" : "#27272a",
              }}
            />
          ))}
        </motion.div>

        {/* Middle Segment: Dynamic Comment */}
        <motion.p
          variants={itemVariants}
          className="text-sm font-medium italic text-zinc-300 leading-relaxed line-clamp-3 my-auto py-2 group-hover:text-zinc-100 transition-colors duration-300"
        >
          &quot;{comment}&quot;
        </motion.p>

        {/* Bottom Segment: User Profile Identity Panel */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 pt-4 border-t border-zinc-900 w-full shrink-0"
        >
          <div className="relative h-9 w-9 shrink-0 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
            {reviewer.avatarUrl ? (
              <Image
                width={40}
                height={40}
                className="h-full w-full rounded-full object-cover bg-zinc-900"
                src={reviewer.avatarUrl}
                alt={reviewer.name}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : null}
            <span className="text-xs font-bold text-zinc-500 absolute">
              {initial}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors duration-300">
              {reviewer.name}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {reviewer.role}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </MagicCard>
  );
}
