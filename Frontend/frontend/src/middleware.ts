import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up");
    const isOnboarding = req.nextUrl.pathname.startsWith("/onboarding");
    const isPublicMarketing =
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/features") ||
      req.nextUrl.pathname.startsWith("/product") ||
      req.nextUrl.pathname.startsWith("/how-it-works") ||
      req.nextUrl.pathname.startsWith("/discovery") ||
      req.nextUrl.pathname.startsWith("/resume-lab") ||
      req.nextUrl.pathname.startsWith("/discoverability") ||
      req.nextUrl.pathname.startsWith("/about") ||
      req.nextUrl.pathname.startsWith("/docs") ||
      req.nextUrl.pathname.startsWith("/recruiters") ||
      req.nextUrl.pathname.startsWith("/pricing");

    const onboardingComplete = !!(req.nextauth.token as { onboardingComplete?: boolean })?.onboardingComplete;

    if (isAuth && isAuthPage) {
      return NextResponse.redirect(
        new URL(onboardingComplete ? "/dashboard" : "/onboarding", req.url)
      );
    }

    if (isAuth && !onboardingComplete && !isOnboarding && !isPublicMarketing) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (isAuth && onboardingComplete && isOnboarding) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isAuth && !isAuthPage && !isPublicMarketing) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/jobs/:path*",
    "/tracker/:path*",
    "/resume/:path*",
    "/marketplace/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/notifications/:path*",
    "/onboarding/:path*",
    "/sign-in",
    "/sign-up",
    "/command-center/:path*",
    "/referrals/:path*",
  ],
};
