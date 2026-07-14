"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, User, Smartphone, Laptop, Tablet, Radar } from "lucide-react";
import { AnimatedBeam } from "../../ui/animated-beam";

interface CircleProps {
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

function Circle({ className, children, size = "md" }: CircleProps) {
  const sizeClasses = {
    sm: "size-10",
    md: "size-14",
    lg: "size-20",
  };

  return (
    <div
      className={cn(
        "z-10 flex items-center justify-center rounded-full border bg-zinc-900/90 backdrop-blur-md shadow-2xl transition-all duration-500 ease-out",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ProviderData {
  id: number;
  name: string;
  icon: React.ReactNode;
  device: string;
  curvature: number;
  startYOffset: number;
}

const PROVIDERS: ProviderData[] = [
  { id: 0, name: "Laptop", icon: <Laptop className="size-5 text-zinc-300" />, device: "Laptop", curvature: -50, startYOffset: -18 },
  { id: 1, name: "Tablet", icon: <Tablet className="size-5 text-zinc-300" />, device: "Tablet", curvature: -18, startYOffset: -6 },
  { id: 2, name: "Phone", icon: <Smartphone className="size-5 text-zinc-300" />, device: "Phone", curvature: 18, startYOffset: 6 },
  { id: 3, name: "Desktop", icon: <User className="size-5 text-zinc-300" />, device: "Desktop", curvature: 50, startYOffset: 18 },
];

export function WorkflowDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const providerRef0 = useRef<HTMLDivElement>(null);
  const providerRef1 = useRef<HTMLDivElement>(null);
  const providerRef2 = useRef<HTMLDivElement>(null);
  const providerRef3 = useRef<HTMLDivElement>(null);
  const providerRefs = [providerRef0, providerRef1, providerRef2, providerRef3];

  const [activeProvider, setActiveProvider] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
  }, []);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    const animateSequence = () => {
      setIsAnimating(true);
      setActiveProvider(null);
      setAccepted(false);

      t1 = setTimeout(() => {
        const randomIdx = Math.floor(Math.random() * PROVIDERS.length);
        setActiveProvider(randomIdx);
        setAccepted(true);

        t2 = setTimeout(() => {
          setIsAnimating(false);
          setActiveProvider(null);
          setAccepted(false);
        }, 2800);
      }, 4200);
    };

    const initialTimeout = setTimeout(animateSequence, 700);
    const interval = setInterval(animateSequence, 8500);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto py-24 px-6 rounded-3xl bg-zinc-950/20 border border-zinc-800/50 overflow-hidden"
      ref={containerRef}
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">System Workflow</h2>
        <p className="text-zinc-400 text-sm">Real-time request distribution and automated acceptance</p>
      </div>

      <div className="flex flex-row items-center justify-between gap-10 md:gap-20">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <Circle
            size="lg"
            className={cn(
              "border-indigo-500/30 bg-zinc-900",
              accepted && "border-green-500/50 shadow-green-900/20"
            )}
          >
            <div ref={userRef} className="flex items-center justify-center">
              {accepted ? (
                <Check className="text-green-400 size-8 animate-in zoom-in spin-in-6 duration-300" />
              ) : (
                <div className="flex flex-col items-center">
                  <User className="size-6 text-indigo-400" />
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                    Post
                  </span>
                </div>
              )}
            </div>
          </Circle>
          <span className="text-xs font-medium text-zinc-500">You</span>
        </div>

        <div className="flex flex-col items-center gap-5 md:gap-6">
          {PROVIDERS.map((provider, idx) => {
            const isChosen = accepted && activeProvider === idx;

            return (
              <div key={provider.id} className="flex flex-row-reverse items-center gap-3">
                <Circle
                  size="md"
                  className={cn(
                    "border-zinc-800 bg-zinc-900",
                    isChosen &&
                      "border-green-500/50 bg-green-950/20 shadow-green-900/20 scale-110"
                  )}
                >
                  <div ref={providerRefs[idx]} className="flex items-center justify-center">
                    {isChosen ? (
                      <Check className="text-green-400 size-6 animate-in zoom-in duration-300" />
                    ) : (
                      <div className="flex flex-col items-center">
                        {provider.icon}
                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                          {provider.device}
                        </span>
                      </div>
                    )}
                  </div>
                </Circle>
                <span
                  className={cn(
                    "text-xs font-medium w-14 text-right transition-colors duration-300",
                    isChosen ? "text-green-400" : "text-zinc-500"
                  )}
                >
                  {isChosen ? "✓ Accepted" : provider.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {isMounted &&
        PROVIDERS.map((provider, idx) => {
          const isChosen = accepted && activeProvider === idx;

          return (
            <AnimatedBeam
              key={provider.id}
              containerRef={containerRef}
              fromRef={userRef}
              toRef={providerRefs[idx]}
              curvature={provider.curvature}
              startYOffset={provider.startYOffset}
              endYOffset={0}
              duration={6}
              reverse={isChosen}
              pathColor={isChosen ? "#22c55e" : "#4f46e5"}
              pathWidth={isChosen ? 2.5 : 1.5}
              pathOpacity={isChosen ? 0.5 : 0.25}
              gradientStartColor={isChosen ? "#22c55e" : "#6366f1"}
              gradientStopColor={isChosen ? "#4ade80" : "#818cf8"}
              className="opacity-100"
            />
          );
        })}

      <div className="text-center mt-10 h-6">
        {accepted && activeProvider !== null ? (
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-green-400 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <Check className="size-4" />
            Request accepted by {PROVIDERS[activeProvider].name}!
          </p>
        ) : isAnimating ? (
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-400">
            <Radar className="size-4 animate-spin [animation-duration:2s]" />
            Sending request to everyone...
          </p>
        ) : (
          <p className="text-sm font-medium text-zinc-500">Looking for available helpers...</p>
        )}
      </div>
    </div>
  );
}