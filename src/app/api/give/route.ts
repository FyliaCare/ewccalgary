import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isValidDonationAmount,
  isValidEmail,
  sanitizeString,
} from "@/lib/validation";

const ALLOWED_CATEGORIES = [
  "tithe",
  "offering",
  "missions",
  "building",
  "youth",
  "general",
  "special",
];
const ALLOWED_CURRENCIES = ["CAD", "USD"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, amount, currency, name, email, isAnonymous } = body;

    if (!category || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Category and amount are required" },
        { status: 400 }
      );
    }

    if (!isValidDonationAmount(amount)) {
      return NextResponse.json(
        { error: "Invalid donation amount. Must be a positive number up to $1,000,000" },
        { status: 400 }
      );
    }

    const sanitizedCategory = sanitizeString(category, 50);
    if (!ALLOWED_CATEGORIES.includes(sanitizedCategory)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const sanitizedCurrency = sanitizeString(currency || "CAD", 3).toUpperCase();
    if (!ALLOWED_CURRENCIES.includes(sanitizedCurrency)) {
      return NextResponse.json(
        { error: `Invalid currency. Must be one of: ${ALLOWED_CURRENCIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const parsedAmount = Math.round(parseFloat(amount) * 100) / 100; // Round to 2 decimal places

    const donation = await prisma.donation.create({
      data: {
        amount: parsedAmount,
        currency: sanitizedCurrency,
        category: sanitizedCategory,
        donorName: isAnonymous ? "Anonymous" : sanitizeString(name || "Anonymous", 200),
        donorEmail: email ? sanitizeString(email, 254) : null,
        status: "completed", // In production, this would be "pending" until Stripe confirms
        stripeSessionId: null, // Would be populated by Stripe checkout
      },
    });

    // TODO: Integrate Stripe for actual payment processing
    // const stripeSession = await stripe.checkout.sessions.create({...});

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Error processing donation:", error);
    return NextResponse.json(
      { error: "Failed to process donation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}
