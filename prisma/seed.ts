import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed departments
  const departments = [
    { name: "Media / Creative", description: "Branding, social media, photography, videography, design, and content creation", icon: "Camera" },
    { name: "Ushering / Protocol", description: "Welcoming guests, seating, maintaining order, and ensuring smooth service flow", icon: "HandHeart" },
    { name: "Worship Team", description: "Choir, vocalists, and worship leaders leading the congregation in praise and worship", icon: "Music" },
    { name: "Technical / Sound", description: "Sound engineering, lighting, projections, and live stream operations", icon: "Monitor" },
    { name: "Kidz Church", description: "Teaching and nurturing children ages 0-13 in the Word of God", icon: "Baby" },
    { name: "FIXED Teens", description: "Youth ministry for teenagers ages 13-19, spiritual and life development", icon: "Users" },
    { name: "4.12 Young Adults", description: "Young adults ministry ages 19-30, based on 1 Timothy 4:12", icon: "GraduationCap" },
    { name: "Hospitality", description: "Food service, refreshments, and creating a welcoming atmosphere", icon: "Coffee" },
    { name: "Community Circle Leader", description: "Leading and facilitating weekly community circle gatherings", icon: "Circle" },
    { name: "Prayer Team", description: "Intercessory prayer, prayer meetings, and spiritual warfare", icon: "HeartHandshake" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: dept,
      create: dept,
    });
  }

  // Seed admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "EWCAdmin2026!", 12);
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@ewccalgary.ca" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@ewccalgary.ca",
      password: hashedPassword,
      name: "EWC Admin",
      role: "admin",
    },
  });

  // Seed sample events
  const events = [
    {
      title: "Sunday Family Service",
      description: "Join us for our weekly Sunday Family Service. Experience powerful worship, the Word of God, and genuine fellowship with the EWC Calgary family.",
      date: new Date("2026-02-15"),
      time: "10:00",
      endTime: "12:30",
      location: "225 Chaparral Drive SE, Calgary, Alberta",
      category: "service",
      featured: true,
      published: true,
    },
    {
      title: "Community Circle Meeting",
      description: "Weekly small group gathering. Dive deeper into the Word, build relationships, and grow together in faith. All community circles meet across Calgary.",
      date: new Date("2026-02-17"),
      time: "19:00",
      endTime: "21:00",
      location: "Various locations across Calgary",
      category: "community",
      featured: false,
      published: true,
    },
    {
      title: "Prayer Night",
      description: "A powerful night of intercessory prayer and spiritual warfare. Come and experience the presence of God as we pray and seek His face together.",
      date: new Date("2026-02-20"),
      time: "19:00",
      endTime: "21:00",
      location: "225 Chaparral Drive SE, Calgary, Alberta",
      category: "prayer",
      featured: true,
      published: true,
    },
    {
      title: "Youth Night - FIXED Teens",
      description: "An exciting evening designed for teenagers ages 13-19. Games, worship, and a powerful Word tailored for the next generation.",
      date: new Date("2026-02-21"),
      time: "17:00",
      endTime: "19:00",
      location: "225 Chaparral Drive SE, Calgary, Alberta",
      category: "youth",
      featured: false,
      published: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  // Seed sample sermons
  const sermons = [
    {
      title: "And This Gospel",
      speaker: "Prophet Gideon Danso",
      date: new Date("2026-01-26"),
      youtubeUrl: "https://www.youtube.com/watch?v=ceDoCT-LIgM",
      series: "Empowerment Conference 2026",
      description: "A powerful message from the Empowerment Conference 2026 by our Global Lead Pastor, Prophet Gideon Danso.",
      featured: true,
      published: true,
    },
    {
      title: "Walking in Purpose",
      speaker: "Pastor Humphrey Lomotey",
      date: new Date("2026-02-02"),
      youtubeUrl: "https://www.youtube.com/watch?v=DMGHFb1ncYc",
      series: "Purpose Series",
      description: "Discover your God-given purpose and walk boldly in it. A message from our Calgary Campus Pastor.",
      featured: false,
      published: true,
    },
    {
      title: "The Power of Prayer",
      speaker: "Prophet Gideon Danso",
      date: new Date("2026-02-09"),
      youtubeUrl: "https://www.youtube.com/watch?v=tl7NF-MWy8I",
      series: "Prayer Factory",
      description: "Understanding the power and necessity of prayer in the life of every believer.",
      featured: true,
      published: true,
    },
  ];

  for (const sermon of sermons) {
    await prisma.sermon.create({ data: sermon });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
