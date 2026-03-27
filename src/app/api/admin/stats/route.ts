import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value ?? null;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const [
      totalBookings,
      confirmedBookings,
      totalPilots,
      totalSessions,
      pendingMessages,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.pilot.count(),
      prisma.session.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { pilot: true, session: true },
      }),
    ]);

    return NextResponse.json({
      totalBookings,
      confirmedBookings,
      totalPilots,
      totalSessions,
      pendingMessages,
      recentBookings,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
