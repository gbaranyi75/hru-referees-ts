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

  if (isProtectedRoute(req)) await auth.protect();

  const { userId, sessionClaims } = await auth();
  const claims = sessionClaims as ClerkSessionClaims;

  // Admin guard for dashboard routes
  if (isAdminRoute(req) && claims?.metadata?.role !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (userId) {
    const approved = claims?.metadata?.approved === true;

    // Csak a védett útvonalakat blokkoljuk a függőben lévő felhasználóknak
    if (!approved && isProtectedRoute(req)) {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Hozzáadtam a png-t és az svg-t a kizáráshoz
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
