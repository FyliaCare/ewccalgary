import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";
import { sanitizeContent } from "@/lib/validation";

// GET — fetch messages in conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ convId: string }> }
) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { convId } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Verify participation
    const conv = await prisma.directConversation.findUnique({
      where: { id: convId },
    });

    if (
      !conv ||
      (conv.member1Id !== auth.memberId && conv.member2Id !== auth.memberId)
    ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const messages = await prisma.directMessage.findMany({
      where: { conversationId: convId, deleted: false },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            isOnline: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    // Mark messages as read
    await prisma.directMessage.updateMany({
      where: {
        conversationId: convId,
        receiverId: auth.memberId,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      messages: messages.reverse(),
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Fetch DM messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST — send a DM
export async function POST(
  request: Request,
  { params }: { params: Promise<{ convId: string }> }
) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { convId } = await params;
    const { content, type } = await request.json();

    const sanitizedContent = sanitizeContent(content, 5000);
    if (!sanitizedContent) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    const conv = await prisma.directConversation.findUnique({
      where: { id: convId },
    });

    if (
      !conv ||
      (conv.member1Id !== auth.memberId && conv.member2Id !== auth.memberId)
    ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const receiverId =
      conv.member1Id === auth.memberId ? conv.member2Id : conv.member1Id;

    const message = await prisma.directMessage.create({
      data: {
        conversationId: convId,
        senderId: auth.memberId,
        receiverId,
        content: sanitizedContent,
        type: ["text", "image", "link"].includes(type) ? type : "text",
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            isOnline: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await prisma.directConversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Send DM error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
