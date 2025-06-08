import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSession } from "@/lib/session";

const publicRoutes = ["/auth/login", "/auth/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  if (path === "/auth/logout") {
    await deleteSession();
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
