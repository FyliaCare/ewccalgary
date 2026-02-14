import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(sermons);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, speaker, description, date, youtubeUrl, series, thumbnailUrl } = body;

    if (!title || !speaker) {
      return NextResponse.json(
        { error: "Title and speaker are required" },
        { status: 400 }
      );
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        speaker,
        description: description || null,
        date: date ? new Date(date) : new Date(),
        youtubeUrl: youtubeUrl || null,
        series: series || null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    console.error("Error creating sermon:", error);
    return NextResponse.json(
      { error: "Failed to create sermon" },
      { status: 500 }
    );
  }
}
