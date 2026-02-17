import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: {
        ticketTypes: {
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { registrations: true } } },
        },
        _count: { select: { registrations: true } },
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      registrationOpen,
      registrationDeadline,
      maxCapacity,
      requireApproval,
      ticketTypes,
    } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        time: time || null,
        endTime: endTime || null,
        location: location || null,
        category: category || "general",
        image: image || null,
        featured: featured || false,
        registrationOpen: registrationOpen || false,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : null,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        requireApproval: requireApproval || false,
        ticketTypes: ticketTypes?.length
          ? {
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
                  isFree: t.isFree !== undefined ? t.isFree : (t.price || 0) === 0,
                  sortOrder: i,
                })
              ),
            }
          : undefined,
      },
      include: {
        ticketTypes: true,
        _count: { select: { registrations: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
