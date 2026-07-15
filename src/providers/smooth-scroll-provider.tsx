"use client";

import React from "react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        // Desktop
        lerp: 0.08,

        // Mobile
        syncTouch: false,

        // Consistent scrolling
        wheelMultiplier: 1,
        touchMultiplier: 1,

        // Optional
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}