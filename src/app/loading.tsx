export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Top progress line */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-zinc-900">
        <div className="h-full bg-indigo-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>

      {/* Central Identity */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm font-mono tracking-widest text-zinc-500 animate-pulse">
          SYSTEM_INITIALIZING
        </div>
        
        {/* Modern minimal loader */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 30%; margin-left: 70%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}