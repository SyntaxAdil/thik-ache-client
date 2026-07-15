"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";

interface MapPin {
  lat: number;
  lon: number;
  label: string;
  user: string;
}

const DHAKA_SPOTS: MapPin[] = [
  { lat: 23.8223, lon: 90.3654, label: "Mirpur - Repair Task", user: "Adil" },
  { lat: 23.7461, lon: 90.3742, label: "Dhanmondi - Delivery", user: "Rahman" },
  { lat: 23.7936, lon: 90.4066, label: "Banani - Design Task", user: "Saima" },
];

const BBOX = {
  minLon: 90.2558,
  maxLon: 90.5162,
  minLat: 23.72,
  maxLat: 23.84,
};

function toPercent(lat: number, lon: number) {
  const left = ((lon - BBOX.minLon) / (BBOX.maxLon - BBOX.minLon)) * 100;
  const top = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return { top, left };
}

export function DhakaMapVisual() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const points = DHAKA_SPOTS.map((spot) => ({ ...spot, ...toPercent(spot.lat, spot.lon) }));

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount((prev) => prev + 1);
  };

  // Reset loading state when retry changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        // If still loading after 5 seconds, treat as error
        setIsLoading(false);
        setHasError(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoading, retryCount]);

  return (
    <div className="relative w-full aspect-[2/1] rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden select-none">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/80">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <span className="text-xs text-zinc-500">Loading map...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950/90">
          <div className="flex flex-col items-center gap-4 p-6 text-center max-w-sm">
            <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
              <MapPin className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Map unavailable</p>
              <p className="text-xs text-zinc-500 mt-1">Unable to load the map at this moment</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Map Iframe */}
      <iframe
        key={`map-${retryCount}`}
        title="Map of Dhaka"
        className="absolute inset-0 w-full h-full grayscale invert-[0.92] contrast-[1.15] transition-opacity duration-500"
        style={{ 
          border: 0, 
          pointerEvents: "none",
          opacity: isLoading || hasError ? 0 : 1,
        }}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${BBOX.minLon}%2C${BBOX.minLat}%2C${BBOX.maxLon}%2C${BBOX.maxLat}&layer=mapnik`}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />

      {/* Connection Lines */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      >
        <path
          d={`M ${points[0].left} ${points[0].top} L ${points[1].left} ${points[1].top} L ${points[2].left} ${points[2].top} Z`}
          fill="none"
          stroke="url(#dhaka-glow-gradient)"
          strokeWidth="0.4"
          strokeDasharray="1.2 1.2"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id="dhaka-glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Pins */}
      {points.map((spot, index) => (
        <div
          key={index}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{
            top: `${spot.top}%`,
            left: `${spot.left}%`,
          }}
        >
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-zinc-900/95 border border-zinc-800 text-[11px] font-medium text-zinc-200 shadow-2xl backdrop-blur-md whitespace-nowrap mb-2 transition-all duration-300 hover:border-zinc-700 hover:-translate-y-0.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-400 font-semibold">{spot.user}:</span>
            <span className="text-zinc-300">{spot.label}</span>
          </div>

          <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-zinc-950 shadow-lg" />
        </div>
      ))}

      {/* Bottom Label */}
      <div className="absolute bottom-3 right-4 px-2 py-1 rounded border border-zinc-900 bg-zinc-950/80 text-[10px] uppercase tracking-widest font-bold text-zinc-500 z-20">
        Dhaka Hub Feed
      </div>
    </div>
  );
}