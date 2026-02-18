import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getMemberFromToken(): Promise<{
  memberId: string;
  email: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("member-token")?.value;
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (payload.type !== "member" || !payload.memberId) return null;

    return {
      memberId: payload.memberId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
