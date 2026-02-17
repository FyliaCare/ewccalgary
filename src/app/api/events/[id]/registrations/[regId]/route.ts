import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — update registration (check-in, cancel, approve)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; regId: string } }
) {
  try {
    const body = await request.json();
    const { status, checkedIn, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (checkedIn !== undefined) {
      updateData.checkedIn = checkedIn;
      updateData.checkedInAt = checkedIn ? new Date() : null;
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
