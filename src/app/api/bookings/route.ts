import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, sessionId, participants, notes } = body;

    const numParticipants = Math.max(1, parseInt(participants) || 1);

    if (!name || !email || !sessionId) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    let pilot = await prisma.pilot.findUnique({ where: { email } });
    if (!pilot) {
      pilot = await prisma.pilot.create({
        data: { name, email, phone },
      });
    }

    // Get session with total occupied spots (sum of participants)
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { bookings: { where: { status: { not: "CANCELLED" } } } },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Sesión no encontrada" },
        { status: 404 }
      );
    }

    const occupiedSpots = session.bookings.reduce((sum, b) => sum + b.participants, 0);
    const availableSpots = session.maxPilots - occupiedSpots;

    if (numParticipants > availableSpots) {
      return NextResponse.json(
        { error: `Solo quedan ${availableSpots} lugares disponibles` },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        pilotId_sessionId: {
          pilotId: pilot.id,
          sessionId,
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Ya tenés una reserva para esta sesión" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        pilotId: pilot.id,
        sessionId,
        participants: numParticipants,
        notes,
        status: "CONFIRMED",
      },
      include: {
        session: true,
        pilot: true,
      },
    });

    // Update session status if full
    if (occupiedSpots + numParticipants >= session.maxPilots) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: "FULL" },
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Error al crear la reserva" },
      { status: 500 }
    );
  }
}
