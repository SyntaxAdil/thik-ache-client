"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";
import ShaderBackground from "./ShaderBackground";


export default function Hero(): React.JSX.Element {
  return (
    <section className="relative w-full h-[87vh] min-h-[520px] overflow-hidden bg-black ">
      <ShaderBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
        >
          <Circle className="w-2 h-2 fill-indigo-400 text-indigo-400 animate-pulse" />
          <span className="text-xs font-medium text-zinc-200">
            Now live across all 10 Dhaka zones
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-3xl"
        >
          Hyperlocal Help,
          <br />
          Exchange in Dhaka.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-sm md:text-base text-zinc-300 max-w-xl leading-relaxed"
        >
          The premium exchange platform for neighbors to help neighbors. Find
          trusted assistance for tasks, items, or skills within your
          immediate community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex items-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/explore"
              className={cn(buttonVariants({ variant: "primary" }))}
            >
              Find Help Nearby
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/how-it-works"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}