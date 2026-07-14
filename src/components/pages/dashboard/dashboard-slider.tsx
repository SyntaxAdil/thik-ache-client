"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  ListChecks,
  PlusCircle,
  ShieldCheck,
  Users2,
  LogOut,
  Loader2,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../../shared/logo/logo";
import { authClient, useSession } from "../../../lib/auth/auth-client";

interface MenuItem {
  title: string;
  icon: typeof LayoutDashboard;
  href: string;
}

interface MenuSection {
  group: string;
  roles: Array<"user" | "admin">;
  items: MenuItem[];
}

export default function DashboardSidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: session, isPending, refetch: refetch } = useSession();

  const userClient = session?.user;
  const userRole =
    ((userClient as { role?: string } | undefined)?.role?.toLowerCase() as
      | "user"
      | "admin"
      | undefined) || "user";

  const userInitial = userClient?.name
    ?.trim()
    ?.split(" ")
    ?.slice(0, 2)
    ?.map((w) => w[0]?.toUpperCase())
    ?.join("");

  const menuConfig: MenuSection[] = [
    {
      group: "Dashboard",
      roles: ["user", "admin"],
      items: [{ title: "Overview", icon: LayoutDashboard, href: "/dashboard" }],
    },
    {
      group: "Main Menu",
      roles: ["user"],
      items: [
        { title: "My Tasks", icon: ListChecks, href: "/dashboard/tasks" },
        { title: "My Profile", icon: User, href: "/dashboard/profile" },
      ],
    },
    {
      group: "Activity",
      roles: ["user"],
      items: [
        {
          title: "Posted Requests",
          icon: ListChecks,
          href: "/dashboard/requests",
        },
        {
          title: "Post a Request",
          icon: PlusCircle,
          href: "/dashboard/requests/add",
        },
      ],
    },
    {
      group: "Profile & Settings",
      roles: ["admin"],
      items: [{ title: "My Profile", icon: User, href: "/dashboard/profile" }],
    },
    {
      group: "Administration",
      roles: ["admin"],
      items: [
        { title: "All Users", icon: Users2, href: "/dashboard/users" },
        { title: "Reviews & Ratings", icon: Star, href: "/dashboard/reviews" },
      ],
    },
  ];

  const handleSignOut = async (): Promise<void> => {
    await authClient.signOut();
    refetch();
    router.push("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-800 bg-[#09090b] transition-all duration-300"
    >
      <SidebarHeader
        className={`h-20 flex flex-row items-center justify-between transition-all border-b border-zinc-800/60 ${
          isCollapsed ? "justify-center px-0" : "px-6"
        }`}
      >
        {!isCollapsed ? (
          <>
            <div className="flex flex-col justify-center min-w-0 shrink-0">
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <Logo width={28} height={28}></Logo>
                <span className="text-sm font-extrabold tracking-tight text-indigo-400 transition-colors duration-300">
                  ThikAche
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SidebarTrigger className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 shadow-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" />
            </div>
          </>
        ) : (
          <div className="group relative h-9 w-9 shrink-0 flex items-center justify-center">
            {userRole === "admin" && (
              <span className="absolute -top-1 -right-1 z-10 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
            <div className="absolute inset-0 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 text-sm shadow-sm transition-opacity duration-150 group-hover:opacity-0">
              {userInitial || "U"}
            </div>
            <SidebarTrigger className="absolute inset-0 h-9 w-9 rounded-xl bg-indigo-500/10 opacity-0 transition-opacity duration-150 group-hover:opacity-100 text-indigo-400" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent
        className={`mt-4 space-y-5 ${isCollapsed ? "px-2" : "px-4"}`}
      >
        {userRole === "admin" && !isCollapsed && (
          <div className="mt-1 ms-2 self-start px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs  font-black uppercase tracking-widest text-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.1)]">
            Admin Panel
          </div>
        )}
        {menuConfig.map((section) => {
          if (!section.roles.includes(userRole)) return null;

          return (
            <div key={section.group} className="space-y-1">
              {!isCollapsed && (
                <span className="text-[10px] font-black tracking-widest text-zinc-550 uppercase px-3 block mb-1.5">
                  {section.group}
                </span>
              )}
              <SidebarMenu className="gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        tooltip={item.title}
                        className={`w-full flex items-center h-10 rounded-xl transition-all duration-200 relative group
                          ${
                            isActive
                              ? "bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium"
                          } 
                          ${isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "px-3 gap-3"}`}
                      >
                        <item.icon
                          className={`h-[18px] w-[18px] shrink-0 transition-colors
                            ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-50"}`}
                        />
                        {!isCollapsed && (
                          <span className="text-xs tracking-wide">
                            {item.title}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          );
        })}
      </SidebarContent>

      <SidebarFooter
        className={`p-4 border-t border-zinc-800/60 bg-[#09090b] ${
          isCollapsed ? "items-center px-1" : "space-y-3"
        }`}
      >
        {isPending ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="animate-spin h-4 w-4 text-zinc-500" />
          </div>
        ) : (
          <>
            {!isCollapsed && (
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-800 shrink-0 bg-zinc-800">
                  <Image
                    src={
                      userClient?.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="overflow-hidden flex-1">
                  <h3 className="text-xs font-bold text-zinc-100 truncate leading-tight">
                    {userClient?.name || "User Name"}
                  </h3>
                  <span className="text-[10px] text-zinc-550 block truncate font-medium mt-0.5">
                    {userClient?.email || "user@example.com"}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className={`w-full flex items-center justify-center font-bold text-xs tracking-wide bg-indigo-950/30 text-indigo-400 border border-indigo-900/40 hover:bg-indigo-950/60 rounded-xl transition-all active:scale-98
                ${isCollapsed ? "h-10 w-10 p-0" : "h-10 gap-2 px-4"}`}
            >
              <LogOut className="size-4 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
