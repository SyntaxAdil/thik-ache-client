import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role;
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = pathname.startsWith("/dashboard");

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const adminOnlyRoutes = ["/dashboard/users", "/dashboard/reviews"];
  const isAdminOnly = adminOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminOnly && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const userOnlyRoutes = ["/dashboard/tasks", "/dashboard/requests"];
  const isUserOnly = userOnlyRoutes.some((route) => pathname.startsWith(route));

  if (isUserOnly && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};