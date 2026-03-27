import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function getToken(req: NextRequest): string | null {
  return req.cookies.get("admin-token")?.value ?? null;
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const sessions = await prisma.session.findMany({
      include: {
        _count: { select: { bookings: true } },
        bookings: { include: { pilot: true } },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Admin sessions error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { date, startTime, endTime, maxPilots, price } = body;

    const session = await prisma.session.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        maxPilots: maxPilots ? parseInt(maxPilots) : 10,
        price: parseFloat(price),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Admin session create error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
