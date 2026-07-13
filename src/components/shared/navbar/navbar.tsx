"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "../logo/logo";
import { useSession } from "../../../lib/auth/auth-client";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { DHAKA_AREAS } from "../../../assets/dhaka-top-areas";
import AvatarUserDropdown from "../../shared/avatar-dropdown";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Explore", href: "/explore" },
  { name: "Community", href: "/community" },
  { name: "Trust Center", href: "/trust" },
];

const MotionLink = motion.create(Link);

export default function Navbar(): React.JSX.Element {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [selectedArea, setSelectedArea] = useState<string>(DHAKA_AREAS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userArea = (user as { area?: string } | undefined)?.area;
    if (userArea) {
      setTimeout(() => {
        setSelectedArea(userArea);
      }, 0);
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-zinc-900 bg-black/40 backdrop-blur-xl sticky top-0 left-0 right-0 z-50 px-4 md:px-6 select-none"
    >
      <div className="container mx-auto h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <MotionLink
            href="/"
            className="flex items-center gap-2 group shrink-0"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <Logo width={30} height={30}></Logo>
            <span className="text-xl font-extrabold tracking-tight text-primary transition-colors duration-300">
              ThikAche
            </span>
          </MotionLink>

          <motion.div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-900 text-zinc-300 text-xs font-medium max-w-[180px]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
            <span className="truncate">{selectedArea}</span>
          </motion.div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <MotionLink
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                className="relative py-2 text-sm font-medium transition-colors duration-200"
              >
                <span
                  className={
                    isActive
                      ? "text-primary font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }
                >
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </MotionLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {user ? (
              <AvatarUserDropdown variant="navbar" />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  Join Platform
                </Link>
              </div>
            )}
          </motion.div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-zinc-900 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-zinc-900 bg-black"
          >
            <div className="flex flex-col gap-1 py-4">
              <div className="px-3 pb-3 sm:hidden">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-950 border border-zinc-900 text-zinc-300 text-xs font-medium w-full">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{selectedArea}</span>
                </div>
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-zinc-900/60"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="h-px bg-zinc-900 my-2" />

              {user ? (
                <div className="px-3 py-1">
                  <AvatarUserDropdown variant="navbar" />
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-center"
                    )}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant: "primary" }),
                      "w-full justify-center"
                    )}
                  >
                    Join Platform
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}