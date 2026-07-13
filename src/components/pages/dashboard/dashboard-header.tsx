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
  title: string;
}

export default function DashboardHeader({
  title,
}: DashboardHeaderProps): React.JSX.Element {
  const pathname = usePathname();

  const segments = pathname ? pathname.split("/").filter(Boolean) : [];

  return (
    <nav className="flex items-center justify-between gap-4 pe-4 py-2 border-b border-zinc-900 mb-4 select-none sticky top-0 left-0 right-0 z-50 bg-zinc-950">
      {/* Header Title */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title || "Dashboard"}
        </h1>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;
              const formattedName =
                segment.charAt(0).toUpperCase() + segment.slice(1);

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formattedName}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={href} />}>
                        {formattedName}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Notification & Avatar */}
      <div className="flex items-center gap-3">
        <DashboardNotification />
        <AvatarUserDropdown variant="dashboard" />
      </div>
    </nav>
  );
}
