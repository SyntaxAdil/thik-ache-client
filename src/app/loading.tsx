export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="fixed top-0 left-0 h-[2px] w-full bg-zinc-900">
        <div className="h-full bg-indigo-500 animate-loading"></div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse font-mono text-sm tracking-widest text-zinc-500">
          SYSTEM_INITIALIZING
        </div>

        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}