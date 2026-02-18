import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEventRegistrationConfirmation } from "@/lib/email";
import {
  isValidEmail,
  sanitizeString,
} from "@/lib/validation";

function generateTicketCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "EWC-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET registrations for an event (admin only — protected by middleware)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: params.id },
      include: { ticketType: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

// POST — register for an event (public)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { ticketTypeId, firstName, lastName, email, phone, numberOfTickets } =
      body;

    if (!ticketTypeId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, email, and ticket type are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const sanitizedFirstName = sanitizeString(firstName, 200);
    const sanitizedLastName = sanitizeString(lastName, 200);
    const sanitizedEmail = sanitizeString(email, 254);
    const sanitizedPhone = phone ? sanitizeString(phone, 20) : null;

    const qty = Math.max(1, Math.min(numberOfTickets || 1, 20));

    // Fetch the event with ticket type
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        ticketTypes: {
          include: { _count: { select: { registrations: true } } },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.registrationOpen) {
      return NextResponse.json(
        { error: "Registration is not open for this event" },
        { status: 400 }
      );
    }

    // Check registration deadline
    if (
      event.registrationDeadline &&
      new Date() > new Date(event.registrationDeadline)
    ) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    // Find the ticket type
    const ticketType = event.ticketTypes.find(
      (t) => t.id === ticketTypeId
    );
    if (!ticketType) {
      return NextResponse.json(
        { error: "Invalid ticket type" },
        { status: 400 }
      );
    }

    // Check max per order
    if (qty > ticketType.maxPerOrder) {
      return NextResponse.json(
        {
          error: `Maximum ${ticketType.maxPerOrder} tickets per registration`,
        },
        { status: 400 }
      );
    }

    // Use a transaction to prevent race conditions on capacity checks
    const registration = await prisma.$transaction(async (tx) => {
      // Check ticket type capacity inside transaction
      if (ticketType.quantity !== null) {
        const issuedResult = await tx.eventRegistration.aggregate({
          where: {
            ticketTypeId: ticketType.id,
            status: { not: "cancelled" },
          },
          _sum: { numberOfTickets: true },
        });
        const issued = issuedResult._sum.numberOfTickets || 0;
        if (issued + qty > ticketType.quantity) {
          throw new Error("NOT_ENOUGH_TICKETS");
        }
      }

      // Check overall event capacity inside transaction
      if (event.maxCapacity !== null) {
        const totalResult = await tx.eventRegistration.aggregate({
          where: {
            eventId: event.id,
            status: { not: "cancelled" },
          },
          _sum: { numberOfTickets: true },
        });
        const totalIssued = totalResult._sum.numberOfTickets || 0;
        if (totalIssued + qty > event.maxCapacity) {
          throw new Error("EVENT_FULL");
        }
      }

      // Generate unique ticket code with collision check
      let ticketCode = generateTicketCode();
      let attempts = 0;
      while (attempts < 20) {
        const existing = await tx.eventRegistration.findUnique({
          where: { ticketCode },
        });
        if (!existing) break;
        ticketCode = generateTicketCode();
        attempts++;
        if (attempts >= 20) {
          throw new Error("TICKET_CODE_GENERATION_FAILED");
        }
      }

      const status = event.requireApproval ? "pending" : "confirmed";

      return await tx.eventRegistration.create({
        data: {
          eventId: event.id,
          ticketTypeId: ticketType.id,
          ticketCode,
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          numberOfTickets: qty,
          status,
        },
        include: { ticketType: true, event: true },
      });
    });

    // Send confirmation email (non-blocking)
    sendEventRegistrationConfirmation({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      eventTitle: event.title,
      eventDate: event.date.toISOString(),
      eventTime: event.time,
      eventLocation: event.location,
      ticketType: ticketType.name,
      ticketCode: registration.ticketCode,
      numberOfTickets: qty,
      status: registration.status,
    }).catch(() => {});

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    // Handle expected business-logic errors from the transaction
    if (error instanceof Error) {
      if (error.message === "NOT_ENOUGH_TICKETS") {
        return NextResponse.json(
          { error: "Not enough tickets available" },
          { status: 400 }
        );
      }
      if (error.message === "EVENT_FULL") {
        return NextResponse.json(
          { error: "Event is at full capacity" },
          { status: 400 }
        );
      }
      if (error.message === "TICKET_CODE_GENERATION_FAILED") {
        return NextResponse.json(
          { error: "Failed to generate ticket code. Please try again." },
          { status: 500 }
        );
      }
    }
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
