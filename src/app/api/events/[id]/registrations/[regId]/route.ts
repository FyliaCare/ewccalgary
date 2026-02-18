import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_REG_STATUSES = ["pending", "confirmed", "cancelled", "waitlisted"];

// PATCH — update registration (check-in, cancel, approve)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; regId: string } }
) {
  try {
    const body = await request.json();
    const { status, checkedIn, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      if (!ALLOWED_REG_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${ALLOWED_REG_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (notes !== undefined) {
      updateData.notes = typeof notes === "string" ? notes.slice(0, 2000) : null;
    }
    if (checkedIn !== undefined) {
      updateData.checkedIn = Boolean(checkedIn);
      updateData.checkedInAt = checkedIn ? new Date() : null;
    }

    // Verify registration belongs to this event
    const existingReg = await prisma.eventRegistration.findUnique({
      where: { id: params.regId },
    });
    if (!existingReg || existingReg.eventId !== params.id) {
      return NextResponse.json(
        { error: "Registration not found for this event" },
        { status: 404 }
      );
    }

    const registration = await prisma.eventRegistration.update({
      where: { id: params.regId },
      data: updateData,
      include: { ticketType: true },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "Failed to update registration" },
      { status: 500 }
    );
  }
}

// DELETE — remove registration
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; regId: string } }
) {
  try {
    // Verify registration belongs to this event
    const existingReg = await prisma.eventRegistration.findUnique({
      where: { id: params.regId },
    });
    if (!existingReg || existingReg.eventId !== params.id) {
      return NextResponse.json(
        { error: "Registration not found for this event" },
        { status: 404 }
      );
    }

    await prisma.eventRegistration.delete({
      where: { id: params.regId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}
