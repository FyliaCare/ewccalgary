import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, displayName } =
      await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check existing
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const member = await prisma.member.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        displayName: displayName || `${firstName} ${lastName}`,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    // Auto-join public rooms
    const publicRooms = await prisma.chatRoom.findMany({
      where: { type: "public" },
    });
    if (publicRooms.length > 0) {
      await prisma.chatRoomMember.createMany({
        data: publicRooms.map((room) => ({
          roomId: room.id,
          memberId: member.id,
        })),
        skipDuplicates: true,
      });
    }

    // Generate JWT
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = await new SignJWT({
      memberId: member.id,
      email: member.email,
      type: "member",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(secret));

    const response = NextResponse.json(member, { status: 201 });
    response.cookies.set("member-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Member registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
