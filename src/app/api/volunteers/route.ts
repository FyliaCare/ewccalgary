import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVolunteerConfirmation } from "@/lib/email";
import {
  isValidEmail,
  sanitizeString,
  sanitizeContent,
} from "@/lib/validation";

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: { department: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { error: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
      departmentId,
      skills,
      experience,
      availability,
    } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Required fields: firstName, lastName, email, phone" },
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
    const sanitizedEmail = sanitizeString(email, 254).toLowerCase();
    const sanitizedPhone = sanitizeString(phone, 20);

    // Check for existing application
    const existing = await prisma.volunteer.findUnique({ where: { email: sanitizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "A volunteer application with this email already exists" },
        { status: 409 }
      );
    }

    // Collect extra fields not in schema — store in notes
    const { secondaryDepartment, previousChurch, yearsInFaith, startDate, commitmentLevel, additionalNotes } = body;
    const extraInfo = [
      secondaryDepartment && `Secondary Department: ${secondaryDepartment}`,
      previousChurch && `Previous Church: ${previousChurch}`,
      yearsInFaith && `Years in Faith: ${yearsInFaith}`,
      startDate && `Preferred Start Date: ${startDate}`,
      commitmentLevel && `Commitment Level: ${commitmentLevel}`,
      additionalNotes && `Additional Notes: ${additionalNotes}`,
    ].filter(Boolean).join(" | ");

    // Find department by name match
    let deptConnect = undefined;
    let departmentName = "";
    if (departmentId) {
      // The form sends slugs like "media-creative", so we normalize and search
      const searchTerm = departmentId.replace(/-/g, " ");
      const dept = await prisma.department.findFirst({
        where: {
          OR: [
            { id: departmentId },
            { name: { contains: searchTerm } },
          ],
        },
      });
      if (dept) {
        deptConnect = { connect: { id: dept.id } };
        departmentName = dept.name;
      }
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        address: address ? sanitizeString(address, 500) : null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender ? sanitizeString(gender, 20) : null,
        skills: skills ? sanitizeContent(skills, 2000) : null,
        experience: experience ? sanitizeContent(experience, 2000) : null,
        availability: availability ? sanitizeString(availability, 200) : null,
        notes: extraInfo || "",
        status: "pending",
        department: deptConnect,
      },
      include: { department: true },
    });

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    sendVolunteerConfirmation({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      department: departmentName || "Not specified",
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json(volunteer, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json(
      { error: "Failed to create volunteer" },
      { status: 500 }
    );
  }
}
