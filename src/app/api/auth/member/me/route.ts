import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
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
        updateData[field] = body[field];
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
