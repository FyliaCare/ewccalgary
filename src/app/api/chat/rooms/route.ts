import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

// GET — list rooms the member belongs to (with unread counts)
export async function GET() {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memberships = await prisma.chatRoomMember.findMany({
      where: { memberId: auth.memberId },
      include: {
        room: {
          include: {
            _count: { select: { messages: true, members: true } },
            messages: {
              where: { deleted: false },
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                sender: {
                  select: { displayName: true, avatar: true },
                },
              },
            },
          },
        },
      },
      orderBy: { room: { updatedAt: "desc" } },
    });

    // Calculate unread counts
    const rooms = await Promise.all(
      memberships.map(async (m) => {
        const unread = await prisma.chatMessage.count({
          where: {
            roomId: m.roomId,
            createdAt: { gt: m.lastRead },
            deleted: false,
            senderId: { not: auth.memberId },
          },
        });

        return {
          ...m.room,
          lastMessage: m.room.messages[0] || null,
          unread,
          muted: m.muted,
          myRole: m.role,
          lastRead: m.lastRead,
        };
      })
    );

    // Sort: pinned first, then by latest message
    rooms.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const aTime = a.lastMessage?.createdAt || a.createdAt;
      const bTime = b.lastMessage?.createdAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// POST — create a new room (leaders/moderators only, or anyone for now)
export async function POST(request: Request) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, icon, type, color } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    const room = await prisma.chatRoom.create({
      data: {
        name,
        description: description || null,
        icon: icon || "MessageCircle",
        type: type || "public",
        color: color || "#7B2D3B",
        createdBy: auth.memberId,
        members: {
          create: {
            memberId: auth.memberId,
            role: "admin",
          },
        },
      },
      include: {
        _count: { select: { members: true, messages: true } },
      },
    });

    // Auto-join all members if public
    if (room.type === "public") {
      const allMembers = await prisma.member.findMany({
        where: { id: { not: auth.memberId } },
        select: { id: true },
      });

      if (allMembers.length > 0) {
        await prisma.chatRoomMember.createMany({
          data: allMembers.map((m) => ({
            roomId: room.id,
            memberId: m.id,
          })),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
