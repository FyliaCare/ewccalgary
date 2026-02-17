import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        ticketTypes: {
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { registrations: true } } },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
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
    const {
      title,
      description,
      date,
      time,
      endTime,
      location,
      category,
      image,
      featured,
      published,
      registrationOpen,
      registrationDeadline,
      maxCapacity,
      requireApproval,
      ticketTypes,
    } = body;

    // Build update data — only include provided fields
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (time !== undefined) updateData.time = time;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (location !== undefined) updateData.location = location;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (featured !== undefined) updateData.featured = featured;
    if (published !== undefined) updateData.published = published;
    if (registrationOpen !== undefined)
      updateData.registrationOpen = registrationOpen;
    if (registrationDeadline !== undefined)
      updateData.registrationDeadline = registrationDeadline
        ? new Date(registrationDeadline)
        : null;
    if (maxCapacity !== undefined)
      updateData.maxCapacity = maxCapacity ? parseInt(maxCapacity) : null;
    if (requireApproval !== undefined)
      updateData.requireApproval = requireApproval;

    // Handle ticket types: delete old, create new
    if (ticketTypes !== undefined) {
      await prisma.eventTicketType.deleteMany({
        where: { eventId: params.id },
      });
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(ticketTypes !== undefined && {
          ticketTypes: {
            create: ticketTypes.map(
              (
                t: {
                  name: string;
                  description?: string;
                  price?: number;
                  quantity?: number;
                  maxPerOrder?: number;
                  isFree?: boolean;
                },
                i: number
              ) => ({
                name: t.name,
                description: t.description || null,
                price: t.price || 0,
                quantity: t.quantity || null,
                maxPerOrder: t.maxPerOrder || 10,
                isFree:
                  t.isFree !== undefined ? t.isFree : (t.price || 0) === 0,
                sortOrder: i,
              })
            ),
          },
        }),
      },
      include: {
        ticketTypes: { orderBy: { sortOrder: "asc" } },
        _count: { select: { registrations: true } },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
