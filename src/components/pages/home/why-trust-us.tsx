"use client";

import React from "react";
import { ShieldCheck, UserCheck, Zap, Headphones, HeartHandshake } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Verified Community",
    description: "Every neighbor is verified through our secure ID process to ensure safety.",
  },
  {
    icon: UserCheck,
    title: "Trusted Helpers",
    description: "Our helpers are rated by the community and have a proven track record.",
  },
  {
    icon: Zap,
    title: "Fast Response",
    description: "Get connected with help in your area within minutes, not days.",
  },
{
    icon: HeartHandshake,
    title: "Community Driven",
    description: "Built by the community, for the community, to foster local support and growth.",
  },
];

export function WhyTrustUs() {
  return (
    <section className="py-24 bg-black w-full text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-4">
          <SectionHeading
            title="Why Trust Us"
            subtitle="We prioritize safety, reliability, and community-driven support in everything we do."
            align="center"
            className="max-w-xl text-zinc-400"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="group p-6 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-xl bg-zinc-900 group-hover:bg-indigo-500/10 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-zinc-100">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}