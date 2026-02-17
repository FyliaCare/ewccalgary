import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

// GET — member directory
export async function GET(request: Request) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const members = await prisma.member.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { displayName: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        displayName: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
      orderBy: [{ isOnline: "desc" }, { displayName: "asc" }],
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Fetch members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
