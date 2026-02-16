import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/api/(.*)",
  "/profil",
  "/dashboard/(.*)",
  "/jv-elerhetoseg",
  "/dokumentumok",
];

const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);
const isProtectedRoute = createRouteMatcher(protectedRoutes);

export default clerkMiddleware(async (auth, req) => {
  type ClerkSessionClaims = {
    metadata?: {
      approved?: boolean;
      role?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  const protectedRoute = isProtectedRoute(req);
  const adminRoute = isAdminRoute(req);

  // Kivétel: /api/send-email route legyen publikus
  const pathname = new URL(req.url).pathname;
  if (pathname === "/api/send-email") {
    return;
  }

  // Skip auth claim resolution entirely for public routes.
  if (!protectedRoute && !adminRoute) {
    return;
  }

  if (protectedRoute) await auth.protect();

  const { userId, sessionClaims } = await auth();
  const claims = sessionClaims as ClerkSessionClaims;

  // Admin guard for dashboard routes
  if (adminRoute && claims?.metadata?.role !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (userId) {
    const approved = claims?.metadata?.approved === true;

    if (!approved && protectedRoute) {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
