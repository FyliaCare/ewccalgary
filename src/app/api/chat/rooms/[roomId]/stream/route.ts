import { prisma } from "@/lib/prisma";
import { getMemberFromToken } from "@/lib/member-auth";

/**
 * SSE endpoint for real-time chat room messages.
 * Replaces 3-second polling with server-sent events.
 *
 * - Authenticates via member-token cookie (sent automatically by EventSource)
 * - Verifies room membership
 * - Polls DB every 2s and pushes new messages as SSE events
 * - Sends heartbeat comments to keep the connection alive
 * - Auto-closes after 55s (serverless-safe); EventSource reconnects automatically
 * - Supports Last-Event-ID header for seamless reconnection
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  // ─── Auth & membership (must happen before stream starts) ───
  const auth = await getMemberFromToken();
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { roomId } = await params;

  const membership = await prisma.chatRoomMember.findUnique({
    where: {
      roomId_memberId: { roomId, memberId: auth.memberId },
    },
  });

  if (!membership) {
    return new Response("Not a member of this room", { status: 403 });
  }

  // ─── Determine the starting point for new messages ───
  const lastEventId = request.headers.get("Last-Event-ID");
  let cursor: Date;

  if (lastEventId) {
    // Resume from where the client left off
    cursor = new Date(lastEventId);
  } else {
    // Start from now (client should do an initial fetch for history)
    cursor = new Date();
  }

  // ─── Stream setup ───
  const encoder = new TextEncoder();
  let alive = true;

  const stream = new ReadableStream({
    start(controller) {
      // Send a connected comment so the client knows the stream is live
      controller.enqueue(encoder.encode(": connected\n\n"));

      const intervalId = setInterval(async () => {
        if (!alive) {
          clearInterval(intervalId);
          return;
        }

        try {
          const newMessages = await prisma.chatMessage.findMany({
            where: {
              roomId,
              createdAt: { gt: cursor },
              deleted: false,
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
              reactions: {
                include: {
                  member: { select: { id: true, displayName: true } },
                },
              },
            },
            orderBy: { createdAt: "asc" },
            take: 50, // Safety cap per poll
          });

          for (const msg of newMessages) {
            const eventData = `id: ${msg.createdAt.toISOString()}\ndata: ${JSON.stringify(msg)}\n\n`;
            controller.enqueue(encoder.encode(eventData));
            cursor = msg.createdAt;
          }

          // Heartbeat to keep the connection alive through proxies
          if (newMessages.length === 0) {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          }
        } catch {
          // DB error — send heartbeat to keep connection alive
          if (alive) {
            try { controller.enqueue(encoder.encode(": heartbeat\n\n")); } catch { /* closed */ }
          }
        }
      }, 2000);

      // Auto-close after 55 seconds (serverless-safe)
      // EventSource will reconnect automatically with Last-Event-ID
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
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}
