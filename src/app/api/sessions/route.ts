import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    const where: Record<string, unknown> = { status: "OPEN" };

    if (dateStr) {
      const date = new Date(dateStr);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: date, lt: nextDay };
    } else {
      where.date = { gte: new Date() };
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: { participants: true },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    // Map to include occupied spots count
    const result = sessions.map((s) => {
      const occupiedSpots = s.bookings.reduce((sum, b) => sum + b.participants, 0);
      return {
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        maxPilots: s.maxPilots,
        price: s.price,
        status: s.status,
        occupiedSpots,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Sessions fetch error:", error);
    return NextResponse.json(
      { error: "Error al obtener sesiones" },
      { status: 500 }
    );
  }
}
