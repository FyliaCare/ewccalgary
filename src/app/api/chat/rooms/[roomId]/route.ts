import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

// GET — room details with members
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            member: {
              select: {
                id: true,
                displayName: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
                role: true,
              },
            },
          },
        },
        _count: { select: { messages: true, members: true } },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Fetch room error:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
