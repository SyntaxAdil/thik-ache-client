import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-zinc-100 p-6">
      <h2 className="text-8xl font-black text-zinc-800">404</h2>
      <p className="text-lg font-medium text-zinc-400 mt-4">Page not found</p>
      <Link 
        href="/" 
        className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold"
      >
        Return Home
      </Link>
    </main>
  );
}