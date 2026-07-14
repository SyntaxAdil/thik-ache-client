"use client";

import React from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-3 max-w-3xl mb-16",
        {
          "text-left items-start mx-0": align === "left",
          "text-center items-center mx-auto": align === "center",
          "text-right items-end mx-0 ml-auto": align === "right",
        },
        className
      )}
    >
      <div {...props} className={cn("w-full flex flex-col gap-3 inherited-styles", {
          "items-start": align === "left",
          "items-center": align === "center",
          "items-end": align === "right",
      })}>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className={cn("text-base text-zinc-400 max-w-2xl font-normal leading-relaxed", {
            "text-left": align === "left",
            "text-center": align === "center",
            "text-right": align === "right",
          })}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}