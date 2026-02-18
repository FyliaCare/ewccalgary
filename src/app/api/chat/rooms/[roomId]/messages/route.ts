import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";
import { sanitizeContent } from "@/lib/validation";

// GET — list messages in a room (paginated)
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
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Verify membership
    const membership = await prisma.chatRoomMember.findUnique({
      where: {
        roomId_memberId: { roomId, memberId: auth.memberId },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId, deleted: false },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            role: true,
            isOnline: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: { select: { displayName: true } },
          },
        },
        reactions: {
          include: {
            member: { select: { id: true, displayName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    // Update last read
    await prisma.chatRoomMember.update({
      where: {
        roomId_memberId: { roomId, memberId: auth.memberId },
      },
      data: { lastRead: new Date() },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      hasMore: messages.length === limit,
      nextCursor: messages.length > 0 ? messages[0].id : null,
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST — send a message
export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;
    const { content, type, replyToId } = await request.json();

    const sanitizedContent = sanitizeContent(content, 5000);
    if (!sanitizedContent) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify membership
    const membership = await prisma.chatRoomMember.findUnique({
      where: {
        roomId_memberId: { roomId, memberId: auth.memberId },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    if (membership.muted) {
      return NextResponse.json(
        { error: "You are muted in this room" },
        { status: 403 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: auth.memberId,
        content: sanitizedContent,
        type: ["text", "image", "link", "system", "scripture"].includes(type) ? type : "text",
        replyToId: replyToId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            role: true,
            isOnline: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: { select: { displayName: true } },
          },
        },
        reactions: true,
      },
    });

    // Update room timestamp
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    // Update sender's last read
    await prisma.chatRoomMember.update({
      where: {
        roomId_memberId: { roomId, memberId: auth.memberId },
      },
      data: { lastRead: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
