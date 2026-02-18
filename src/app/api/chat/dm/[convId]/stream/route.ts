import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

/**
 * SSE endpoint for real-time direct messages.
 * Replaces 3-second polling with server-sent events.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ convId: string }> }
) {
  // ─── Auth & participation check (before stream starts) ───
  const auth = await getMemberFromToken();
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { convId } = await params;

  const conv = await prisma.directConversation.findUnique({
    where: { id: convId },
  });

  if (
    !conv ||
    (conv.member1Id !== auth.memberId && conv.member2Id !== auth.memberId)
  ) {
    return new Response("Not authorized", { status: 403 });
  }

  // ─── Determine the starting point for new messages ───
  const lastEventId = request.headers.get("Last-Event-ID");
  let cursor: Date;

  if (lastEventId) {
    cursor = new Date(lastEventId);
  } else {
    cursor = new Date();
  }

  // ─── Stream setup ───
  const encoder = new TextEncoder();
  let alive = true;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(": connected\n\n"));

      const intervalId = setInterval(async () => {
        if (!alive) {
          clearInterval(intervalId);
          return;
        }

        try {
          const newMessages = await prisma.directMessage.findMany({
            where: {
              conversationId: convId,
              createdAt: { gt: cursor },
              deleted: false,
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
            orderBy: { createdAt: "asc" },
            take: 50,
          });

          for (const msg of newMessages) {
            const eventData = `id: ${msg.createdAt.toISOString()}\ndata: ${JSON.stringify(msg)}\n\n`;
            controller.enqueue(encoder.encode(eventData));
            cursor = msg.createdAt;
          }

          // Mark received messages as read
          if (newMessages.some((m) => m.receiverId === auth.memberId)) {
            await prisma.directMessage.updateMany({
              where: {
                conversationId: convId,
                receiverId: auth.memberId,
                read: false,
              },
              data: { read: true },
            });
          }

          if (newMessages.length === 0) {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          }
        } catch {
          if (alive) {
            try { controller.enqueue(encoder.encode(": heartbeat\n\n")); } catch { /* closed */ }
          }
        }
      }, 2000);

      // Auto-close after 55s; EventSource reconnects with Last-Event-ID
      setTimeout(() => {
        alive = false;
        clearInterval(intervalId);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }, 55000);
    },
    cancel() {
      alive = false;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
