"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { useSession, authClient } from "../../lib/auth/auth-client";
import { LayoutDashboard, User as UserIcon, LogOut, Home } from "lucide-react";
import Link from "next/link";

interface AvatarUserDropdownProps {
  variant?: "navbar" | "dashboard";
}

const AvatarUserDropdown = ({ variant = "navbar" }: AvatarUserDropdownProps) => {
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async (): Promise<void> => {
    try {
      await authClient.signOut();
    } catch {
      console.log("Failed to log out");
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus:outline-none group rounded-full">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="w-10 h-10 ring-1 ring-zinc-900 transition-all duration-300 group-hover:ring-indigo-500 cursor-pointer">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-950 text-zinc-400 text-xs border border-zinc-900">
              {user?.name?.slice(0, 2).toUpperCase()}
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
            {user?.name}
          </span>
          <span className="text-xs text-zinc-500 truncate font-normal">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-zinc-900 my-1" />

        {/* Dynamic Route based on variant */}
        {variant === "navbar" ? (
          <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2 text-xs">
            <Link href="/dashboard" className="flex w-full items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-zinc-400" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2 text-xs">
            <Link href="/" className="flex w-full items-center gap-2.5">
              <Home className="w-4 h-4 text-zinc-400" />
              Home
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white rounded-lg cursor-pointer p-2 text-xs">
          <Link href="/profile" className="flex w-full items-center gap-2.5">
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
  );
};

export default AvatarUserDropdown;