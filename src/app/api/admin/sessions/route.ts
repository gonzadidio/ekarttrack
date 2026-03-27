import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function getToken(req: NextRequest): string | null {
  return req.cookies.get("admin-token")?.value ?? null;
}

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return unauthorized();
  }

  try {
    const sessions = await prisma.session.findMany({
      include: {
        _count: { select: { bookings: true } },
        bookings: { include: { pilot: true } },
        turnType: true,
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
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { date, startTime, endTime, maxPilots, price, turnTypeId } = body;

    const session = await prisma.session.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        maxPilots: maxPilots ? parseInt(maxPilots) : 10,
        price: parseFloat(price),
        ...(turnTypeId ? { turnTypeId } : {}),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Admin session create error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { id, date, startTime, endTime, maxPilots, price, status, turnTypeId } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de sesión requerido" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (date !== undefined) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (maxPilots !== undefined) updateData.maxPilots = parseInt(String(maxPilots));
    if (price !== undefined) updateData.price = parseFloat(String(price));
    if (status !== undefined) updateData.status = status;
    if (turnTypeId !== undefined) updateData.turnTypeId = turnTypeId;

    const session = await prisma.session.update({
      where: { id },
      data: updateData,
    });

    // If status changed to CANCELLED, cancel all confirmed bookings
    if (status === "CANCELLED") {
      await prisma.booking.updateMany({
        where: {
          sessionId: id,
          status: "CONFIRMED",
        },
        data: {
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Admin session update error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return unauthorized();
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de sesión requerido" }, { status: 400 });
    }

    // Check for confirmed bookings
    const confirmedCount = await prisma.booking.count({
      where: {
        sessionId: id,
        status: "CONFIRMED",
      },
    });

    if (confirmedCount > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar una sesión con reservas confirmadas" },
        { status: 400 }
      );
    }

    // Delete related bookings first (non-confirmed), then the session
    await prisma.booking.deleteMany({ where: { sessionId: id } });
    await prisma.lapTime.deleteMany({ where: { sessionId: id } });
    await prisma.session.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin session delete error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
