// DNS
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { SmoothCursor } from "../components/ui/smooth-cursor";
import { SmoothScrollProvider } from "../providers/smooth-scroll-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ThikAche — Hyperlocal Help Exchange Platform",
    template: "%s | ThikAche",
  },
  description:
    "A closed-loop, community-driven platform where neighbors connect to request and provide quick local assistance, building real trust in your neighborhood.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        <SmoothScrollProvider>
          <main className="flex-1 flex flex-col">{children}</main>
          <SmoothCursor></SmoothCursor>
          <Toaster
            position="top-center"
            expand={false}
            richColors={false}
            duration={2500}
            closeButton={false}
            toastOptions={{
              style: {
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                borderRadius: "16px",
              },
              className:
                "group font-sans antialiased flex justify-center w-full",
              classNames: {
                toast:
                  "flex gap-3 items-center w-full max-w-sm px-4 py-3 text-foreground rounded-2xl border bg-background/20 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-2xl transition-all duration-300",
                title: "text-sm font-medium tracking-wide",
                description: "text-muted-foreground text-xs font-normal",
                actionButton:
                  "bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-primary/90",
                cancelButton:
                  "bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-muted/80",
                success:
                  "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xl [&_[data-icon]]:text-emerald-400",
                error:
                  "text-rose-400 border-rose-500/20 bg-rose-500/10 backdrop-blur-xl [&_[data-icon]]:text-rose-400",
                info: "text-sky-400 border-sky-500/20 bg-sky-500/10 backdrop-blur-xl [&_[data-icon]]:text-sky-400",
                warning:
                  "text-amber-400 border-amber-500/20 bg-amber-500/10 backdrop-blur-xl [&_[data-icon]]:text-amber-400",
              },
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
