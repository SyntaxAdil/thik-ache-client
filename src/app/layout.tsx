// DNS
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";

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
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster></Toaster>
      </body>
    </html>
  );
}
