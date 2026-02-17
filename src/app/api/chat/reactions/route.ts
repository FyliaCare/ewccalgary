import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

// POST — toggle reaction on a message
export async function POST(request: Request) {
  try {
    const auth = await getMemberFromToken();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId, emoji } = await request.json();
    if (!messageId || !emoji) {
      return NextResponse.json(
        { error: "messageId and emoji required" },
        { status: 400 }
      );
    }

    // Check if reaction exists — toggle
    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_memberId_emoji: {
          messageId,
          memberId: auth.memberId,
          emoji,
        },
      },
    });

    if (existing) {
      await prisma.messageReaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    } else {
      const reaction = await prisma.messageReaction.create({
        data: {
          messageId,
          memberId: auth.memberId,
          emoji,
        },
        include: {
          member: {
            select: { id: true, displayName: true },
          },
        },
      });
      return NextResponse.json({ action: "added", reaction }, { status: 201 });
    }
  } catch (error) {
    console.error("Toggle reaction error:", error);
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}
