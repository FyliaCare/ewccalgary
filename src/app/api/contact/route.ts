import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import {
  isValidEmail,
  sanitizeString,
  sanitizeContent,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeString(name, 200);
    const sanitizedEmail = sanitizeString(email, 254);
    const sanitizedSubject = sanitizeString(subject || "General", 200);
    const sanitizedMessage = sanitizeContent(message, 10000);
    const sanitizedPhone = phone ? sanitizeString(phone, 20) : null;

    if (!sanitizedName || !sanitizedMessage) {
      return NextResponse.json(
        { error: "Name and message cannot be empty" },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        subject: sanitizedSubject,
        message: sanitizedMessage,
      },
    });

    // Send notification email to admin (non-blocking)
    sendContactNotification({
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
    }).catch((err) => console.error("Contact notification email failed:", err));

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
