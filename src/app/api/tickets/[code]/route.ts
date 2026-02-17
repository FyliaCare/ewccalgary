import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — look up a ticket by code (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const registration = await prisma.eventRegistration.findUnique({
      where: { ticketCode: params.code },
      include: {
        event: true,
        ticketType: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error looking up ticket:", error);
    return NextResponse.json(
      { error: "Failed to look up ticket" },
      { status: 500 }
    );
  }
}
