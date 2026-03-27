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
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: { pilot: true, session: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Admin bookings error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { pilot: true, session: true },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
