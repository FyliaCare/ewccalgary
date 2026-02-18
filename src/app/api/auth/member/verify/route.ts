import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auth/member/verify?token=...
 *
 * Verifies a member's email address using the token sent to their inbox.
 * On success, marks the member as verified and redirects to the community page.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token" },
        { status: 400 }
      );
    }

    // Look up the verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { member: { select: { id: true, verified: true } } },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > verification.expiresAt) {
      // Clean up expired token
      await prisma.emailVerification.delete({
        where: { id: verification.id },
      });
      return NextResponse.json(
        { error: "Verification link has expired. Please request a new one." },
        { status: 410 }
      );
    }

    // Already verified? Just redirect.
    if (verification.member.verified) {
      await prisma.emailVerification.delete({
        where: { id: verification.id },
      });

      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://ewccalgary.ca";
      return NextResponse.redirect(
        `${siteUrl}/community?verified=already`
      );
    }

    // Mark member as verified
    await prisma.member.update({
      where: { id: verification.memberId },
      data: { verified: true },
    });

    // Delete verification token (single use)
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    });

    // Redirect to community with success indicator
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://ewccalgary.ca";
    return NextResponse.redirect(`${siteUrl}/community?verified=true`);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
