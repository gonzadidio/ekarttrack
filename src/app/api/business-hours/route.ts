import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    const holidays = await prisma.holiday.findMany({
      where: {
        date: {
          gte: now,
          lte: thirtyDaysLater,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ hours, holidays });
  } catch (error) {
    console.error("Business-hours GET error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
