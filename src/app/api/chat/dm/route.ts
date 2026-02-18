import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

// GET — list DM conversations for current member
export async function GET() {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.directConversation.findMany({
      where: {
        OR: [
          { member1Id: auth.memberId },
          { member2Id: auth.memberId },
        ],
      },
      include: {
        member1: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          },
        },
        member2: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          where: { deleted: false },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Calculate unread
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unread = await prisma.directMessage.count({
          where: {
            conversationId: conv.id,
            receiverId: auth.memberId,
            read: false,
            deleted: false,
          },
        });

        const otherMember =
          conv.member1Id === auth.memberId ? conv.member2 : conv.member1;

        return {
          id: conv.id,
          otherMember,
          lastMessage: conv.messages[0] || null,
          unread,
          updatedAt: conv.updatedAt,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch DMs error:", error);
    return NextResponse.json({ error: "Failed to fetch DMs" }, { status: 500 });
  }
}

// POST — start a new conversation (or retrieve existing)
export async function POST(request: Request) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherMemberId: memberId } = await request.json();

    if (!memberId || memberId === auth.memberId) {
      return NextResponse.json({ error: "Invalid member" }, { status: 400 });
    }

    // Check if conversation exists (either direction)
    const existing = await prisma.directConversation.findFirst({
      where: {
        OR: [
          { member1Id: auth.memberId, member2Id: memberId },
          { member1Id: memberId, member2Id: auth.memberId },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const conv = await prisma.directConversation.create({
      data: {
        member1Id: auth.memberId,
        member2Id: memberId,
      },
    });

    return NextResponse.json(conv, { status: 201 });
  } catch (error) {
    console.error("Create DM error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
