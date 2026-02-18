import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import {
  sanitizeString,
  sanitizeContent,
  isValidAvatarUrl,
} from "@/lib/validation";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("member-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (payload.type !== "member" || !payload.memberId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: payload.memberId as string },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        bio: true,
        phone: true,
        role: true,
        verified: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Touch last seen
    await prisma.member.update({
      where: { id: member.id },
      data: { lastSeen: new Date(), isOnline: true },
    });

    return NextResponse.json(member);
  } catch {
    // Clear the invalid cookie so the browser doesn't keep sending it
    const response = NextResponse.json({ error: "Invalid session" }, { status: 401 });
    response.cookies.delete("member-token");
    return response;
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("member-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (payload.type !== "member" || !payload.memberId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
      "firstName",
      "lastName",
      "displayName",
      "avatar",
      "bio",
      "phone",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "avatar") {
          // Validate avatar URL
          if (body[field] && !isValidAvatarUrl(body[field])) {
            return NextResponse.json(
              { error: "Invalid avatar URL. Must be a valid HTTPS URL." },
              { status: 400 }
            );
          }
          updateData[field] = body[field] ? sanitizeString(body[field], 2048) : null;
        } else if (field === "bio") {
          updateData[field] = sanitizeContent(body[field], 500);
        } else if (field === "phone") {
          updateData[field] = sanitizeString(body[field], 20);
        } else {
          // firstName, lastName, displayName
          const sanitized = sanitizeString(body[field], 100);
          if (sanitized.length === 0 && (field === "firstName" || field === "lastName" || field === "displayName")) {
            return NextResponse.json(
              { error: `${field} cannot be empty` },
              { status: 400 }
            );
          }
          updateData[field] = sanitized;
        }
      }
    }

    const updated = await prisma.member.update({
      where: { id: payload.memberId as string },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        bio: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
