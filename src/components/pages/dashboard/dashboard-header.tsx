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
import AvatarUserDropdown from "../../shared/avatar-dropdown";
import DashboardNotification from "./dashboard-notification";

interface DashboardHeaderProps {
  title?: string;
}

export default function DashboardHeader({
  title,
}: DashboardHeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  
  const lastSegment = segments[segments.length - 1];
  
  // Check if the last segment is a number (ObjectId or numeric ID)
  const isNumericId = lastSegment ? /^[0-9a-fA-F]{24}$/.test(lastSegment) || /^\d+$/.test(lastSegment) : false;
  
  let displayTitle = title || "Dashboard";
  
  if (!title) {
    if (isNumericId && segments.length > 1) {
      // If it's an ID, use the previous segment as the title
      const previousSegment = segments[segments.length - 2];
      displayTitle = previousSegment
        ? previousSegment.charAt(0).toUpperCase() + previousSegment.slice(1)
        : "Dashboard";
    } else if (lastSegment) {
      // Otherwise format the last segment
      displayTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    } else {
      displayTitle = "Dashboard";
    }
  }

  // Format segment for breadcrumb display
  const formatSegment = (segment: string): string => {
    // Check if it's a MongoDB ObjectId (24 hex chars) or numeric ID
    if (/^[0-9a-fA-F]{24}$/.test(segment) || /^\d+$/.test(segment)) {
      return "Profile";
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className="flex items-center justify-between gap-4 pe-4 py-2 border-b border-zinc-900 mb-4 select-none sticky top-0 left-0 right-0 z-50 bg-zinc-950">
      <div className="flex items-center gap-6">
        <h1 className="hidden md:block text-2xl font-bold tracking-tight text-white">
          {displayTitle}
        </h1>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;
              const formattedSegment = formatSegment(segment);

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={href} />}>
                        {formattedSegment}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        <DashboardNotification />
        <AvatarUserDropdown variant="dashboard" />
      </div>
    </nav>
  );
}