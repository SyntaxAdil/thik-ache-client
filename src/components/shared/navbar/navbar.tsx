"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "../logo/logo";
import { useSession, authClient } from "../../../lib/auth/auth-client";
import { buttonVariants } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { DHAKA_AREAS } from "../../../assets/dhaka-top-areas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Explore", href: "/explore" },
  { name: "Tasks", href: "/tasks" },
  { name: "Community", href: "/community" },
  { name: "Safety", href: "/safety" },
];

const MotionLink = motion.create(Link);

export default function Navbar(): React.JSX.Element {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const handleSignOut = async (): Promise<void> => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-zinc-950 bg-black/50 backdrop-blur-md sticky top-0 z-50 px-4 select-none"
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
            <span className="text-xl font-bold tracking-tight text-primary transition-colors duration-300 ">
              ThikAche
            </span>
          </MotionLink>

          <motion.div
            className="w-[160px]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Select defaultValue={DHAKA_AREAS[0]}>
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-900 text-zinc-300 rounded-full h-10 px-4 focus:ring-1 focus:ring-indigo-500 text-xs font-medium">
                <div className="flex items-center gap-2 max-w-[110px] truncate">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <SelectValue placeholder="Select Area" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl max-h-[300px]">
                {DHAKA_AREAS.map((area) => (
                  <SelectItem
                    key={area}
                    value={area}
                    className="focus:bg-zinc-900 focus:text-white cursor-pointer text-xs"
                  >
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="focus:outline-none group rounded-full">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Avatar className="w-10 h-10 ring-1 ring-zinc-900 transition-all duration-300 group-hover:ring-indigo-500 cursor-pointer">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-zinc-950 text-zinc-400 text-xs border border-zinc-900">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-950 border-zinc-900 text-zinc-300 rounded-xl p-1.5 mt-2 shadow-2xl"
              >
                <DropdownMenuLabel className="px-2.5 py-2 flex flex-col">
                  <span className="text-sm font-medium text-white truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-zinc-500 truncate font-normal">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-900 my-1" />
                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2 text-xs">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center gap-2.5"
                  >
                    <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2 text-xs">
                  <Link
                    href="/profile"
                    className="flex w-full items-center gap-2.5"
                  >
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-900 my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="focus:bg-red-950/40 focus:text-red-400 text-red-500 rounded-lg cursor-pointer p-2 text-xs flex items-center gap-2.5 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Login
              </Link>
              <Link href="/register" className={cn(buttonVariants({ variant: "primary" }))}>
                Join Platform
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}