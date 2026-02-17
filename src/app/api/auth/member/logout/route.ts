import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("member-token")?.value;

    if (token) {
      const secret = process.env.NEXTAUTH_SECRET;
      if (secret) {
        try {
          const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(secret)
          );
          if (payload.memberId) {
            await prisma.member.update({
              where: { id: payload.memberId as string },
              data: { isOnline: false, lastSeen: new Date() },
            });
          }
        } catch {
          // Token invalid, just clear it
        }
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("member-token");
    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("member-token");
    return response;
  }
}
