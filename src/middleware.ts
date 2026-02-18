import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  checkRateLimit,
  AUTH_RATE_LIMIT,
  REGISTER_RATE_LIMIT,
  CONTACT_RATE_LIMIT,
} from "@/lib/rate-limit";

const protectedAdminRoutes = [
  "/admin",
  "/admin/volunteers",
  "/admin/departments",
  "/admin/events",
  "/admin/sermons",
  "/admin/giving",
  "/admin/messages",
];

const protectedApiRoutes = [
  "/api/volunteers",
  "/api/departments",
  "/api/events",
  "/api/sermons",
  "/api/contact",
  "/api/give",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname header for layout to detect admin routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // ─── Rate limiting for auth & sensitive POST endpoints ───
  if (request.method === "POST") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    let rateLimitResult = null;

    if (
      pathname === "/api/auth/login" ||
      pathname === "/api/auth/member/login"
    ) {
      rateLimitResult = checkRateLimit(`auth:${ip}`, AUTH_RATE_LIMIT);
    } else if (pathname === "/api/auth/member/register") {
      rateLimitResult = checkRateLimit(`register:${ip}`, REGISTER_RATE_LIMIT);
    } else if (pathname === "/api/contact") {
      rateLimitResult = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
    }

    if (rateLimitResult && !rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(
              Math.ceil(rateLimitResult.resetAt / 1000)
            ),
          },
        }
      );
    }
  }

  // Allow login page, login API, and member auth routes
  if (
    pathname === "/admin/login" ||
    pathname === "/api/auth/login" ||
    pathname.startsWith("/api/auth/member/")
  ) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Community chat API routes — auth handled in route handlers via member-token
  if (pathname.startsWith("/api/chat/")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Protect admin pages
  const isAdminPage = protectedAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Protect sensitive API routes (GET only — POST for volunteers/contact/give are public)
  const isProtectedApi = protectedApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Public POST endpoints (volunteer signup, contact form, giving, event registration)
  const publicPostRoutes = ["/api/volunteers", "/api/contact", "/api/give"];
  const isPublicPost =
    request.method === "POST" &&
    (publicPostRoutes.includes(pathname) ||
      /^\/api\/events\/[^/]+\/register$/.test(pathname));

  // Public GET endpoints (events, sermons, departments, single event, ticket lookup)
  const publicGetRoutes = ["/api/events", "/api/sermons", "/api/departments"];
  const isPublicGet =
    request.method === "GET" &&
    (publicGetRoutes.includes(pathname) ||
      /^\/api\/events\/[^/]+$/.test(pathname) ||
      /^\/api\/tickets\/[^/]+$/.test(pathname));

  if (isAdminPage) {
    return await verifyAuth(request);
  }

  if (isProtectedApi && !isPublicPost && !isPublicGet) {
    return await verifyAuth(request, true);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

async function verifyAuth(request: NextRequest, isApi = false) {
  const token = request.cookies.get("admin-token")?.value;
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-pathname", request.nextUrl.pathname);

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is not set");
      if (isApi) {
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 }
        );
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    // Verify token type is admin (not a member token)
    if (payload.type && payload.type !== "admin") {
      // This is a member token, not an admin token
      if (isApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin-token");
      return response;
    }

    return NextResponse.next({
      request: { headers: reqHeaders },
    });
  } catch {
    // Token invalid or expired
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
    response.cookies.delete("admin-token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
