"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-zinc-100 p-6">
      <h2 className="text-3xl font-black">Something went wrong</h2>
      <p className="text-zinc-500 mt-2">The system encountered an unexpected error.</p>
      <button
        onClick={() => reset()}
        className="mt-6 px-6 py-3 border border-zinc-800 hover:bg-zinc-900 rounded-xl transition-all font-semibold"
      >
        Try again
      </button>
    </main>
  );
}