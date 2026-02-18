import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeString } from "@/lib/validation";

// Whitelist of fields that can be updated via PATCH
const ALLOWED_UPDATE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "dateOfBirth",
  "gender",
  "skills",
  "experience",
  "availability",
  "status",
  "notes",
] as const;

const ALLOWED_STATUSES = ["pending", "approved", "rejected"];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: params.id },
      include: { department: true },
    });

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return NextResponse.json(
      { error: "Failed to fetch volunteer" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Only allow whitelisted fields — prevents mass-assignment attacks
    const updateData: Record<string, unknown> = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (body[field] !== undefined) {
        if (field === "status") {
          if (!ALLOWED_STATUSES.includes(body[field])) {
            return NextResponse.json(
              { error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}` },
              { status: 400 }
            );
          }
          updateData[field] = body[field];
        } else if (field === "dateOfBirth") {
          updateData[field] = body[field] ? new Date(body[field]) : null;
        } else if (typeof body[field] === "string") {
          updateData[field] = sanitizeString(body[field], 1000);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Handle department connection separately
    if (body.departmentId) {
      updateData.department = { connect: { id: body.departmentId } };
    } else if (body.departmentId === null) {
      updateData.department = { disconnect: true };
    }

    const volunteer = await prisma.volunteer.update({
      where: { id: params.id },
      data: updateData,
      include: { department: true },
    });

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return NextResponse.json(
      { error: "Failed to update volunteer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.volunteer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    return NextResponse.json(
      { error: "Failed to delete volunteer" },
      { status: 500 }
    );
  }
}
