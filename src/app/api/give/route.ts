import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, amount, currency, name, email, isAnonymous } = body;

    if (!category || !amount) {
      return NextResponse.json(
        { error: "Category and amount are required" },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        currency: currency || "CAD",
        category,
        donorName: isAnonymous ? "Anonymous" : (name || "Anonymous"),
        donorEmail: email || null,
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
