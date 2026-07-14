"use client";

import React from "react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        // Lower values = smoother/looser scroll feel. Typical range: 0.05 to 0.15
        lerp: 0.1,
        // Syncs touch devices seamlessly without manual workarounds
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
