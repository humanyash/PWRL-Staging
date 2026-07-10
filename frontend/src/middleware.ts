import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk only guards the CMS. The public marketing site never runs through
 * Clerk (matcher below is scoped to /admin), so the site keeps rendering even
 * before Clerk env keys are configured.
 */
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicAdminRoute = createRouteMatcher(["/admin/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isPublicAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/admin/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  // Scope Clerk to the admin dashboard and Clerk's own handshake path only.
  matcher: ["/admin/:path*", "/__clerk/:path*"],
};
