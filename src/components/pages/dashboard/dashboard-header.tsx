"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../../ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import AvatarUserDropdown from "../../shared/avatar-dropdown";
import DashboardNotification from "./dashboard-notification";
import { useSession } from "../../../lib/auth/auth-client";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  phoneNumber?: string;
  area?: string;
  avgRating?: number;
  completedCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SessionWithRole {
  user?: UserWithRole;
}

interface DashboardHeaderProps {
  title?: string;
}

export default function DashboardHeader({
  title,
}: DashboardHeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const { data: session } = useSession() as { data: SessionWithRole | null };
  const userRole = session?.user?.role === "admin" ? "admin" : "user";
  const lastSegment = segments[segments.length - 1];
  
  const isObjectId = (str: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(str);
  };

  const isNumericId = (str: string): boolean => {
    return /^\d+$/.test(str);
  };

  const isId = (str: string): boolean => {
    return isObjectId(str) || isNumericId(str);
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const specialSegments = ["me", "profile", "settings", "account", "reviews", "users", "admin", "dashboard", "tasks", "help", "support"];
  
  const isSpecialSegment = (segment: string): boolean => {
    return specialSegments.includes(segment.toLowerCase());
  };

  let displayTitle = "Dashboard";
  
  if (title) {
    displayTitle = title;
  } else if (lastSegment) {
    if (isId(lastSegment) && segments.length > 1 && !isSpecialSegment(lastSegment)) {
      const previousSegment = segments[segments.length - 2];
      displayTitle = previousSegment ? capitalize(previousSegment) : "Dashboard";
    } else {
      displayTitle = capitalize(lastSegment);
    }
  }

  const formatSegment = (segment: string, index: number): string => {
    const isLast = index === segments.length - 1;
    
    if (isSpecialSegment(segment)) {
      return capitalize(segment);
    }
    
    if (isId(segment)) {
      if (isLast) {
        return "Profile";
      }
      return segment;
    }
    
    return capitalize(segment);
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const breadcrumbVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut", delay: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const actionsVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.2 }
    }
  };

  const breadcrumbItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const iconHoverVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="flex items-center justify-between gap-4 pe-4 py-2 border-b border-zinc-900 mb-4 select-none sticky top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="flex items-center gap-6">
        <motion.h1 
          variants={titleVariants}
          className="hidden md:block text-2xl font-bold tracking-tight text-white"
        >
          {displayTitle}
        </motion.h1>

        <motion.div variants={breadcrumbVariants}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>

              {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const formattedSegment = formatSegment(segment, index);

                return (
                  <React.Fragment key={href}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <motion.div
                          variants={breadcrumbItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={itemVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <BreadcrumbLink render={<Link href={href} />}>
                            {formattedSegment}
                          </BreadcrumbLink>
                        </motion.div>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>
      </div>

      <motion.div 
        variants={actionsVariants}
        className="flex items-center gap-3"
      >
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={iconHoverVariants}
        >
          <DashboardNotification userRole={userRole} />
        </motion.div>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={iconHoverVariants}
        >
          <AvatarUserDropdown variant="dashboard" />
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}