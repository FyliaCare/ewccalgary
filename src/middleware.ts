import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

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

  // Allow login page and login API
  if (pathname === "/admin/login" || pathname === "/api/auth/login") {
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

  // Public POST endpoints (volunteer signup, contact form, giving)
  const publicPostRoutes = ["/api/volunteers", "/api/contact", "/api/give"];
  const isPublicPost =
    request.method === "POST" && publicPostRoutes.includes(pathname);

  // Public GET for departments (volunteer form needs it)
  const isPublicDeptGet =
    request.method === "GET" && pathname === "/api/departments";

  if (isAdminPage) {
    return await verifyAuth(request);
  }

  if (isProtectedApi && !isPublicPost && !isPublicDeptGet) {
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

    await jwtVerify(token, new TextEncoder().encode(secret));
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
