import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function getToken(req: NextRequest): string | null {
  return req.cookies.get("admin-token")?.value ?? null;
}

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "ID de sesión requerido" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: { status: "CONFIRMED" },
          include: { pilot: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    const dateStr = new Date(session.date).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const notifications = session.bookings
      .filter((booking) => booking.pilot.phone)
      .map((booking) => {
        const message = `Hola ${booking.pilot.name}! 🏎️ Te recordamos tu turno en eKartTrack el ${dateStr} a las ${session.startTime}hs. ¡Te esperamos! 🏁`;
        const phone = booking.pilot.phone!.replace(/[^0-9]/g, "");
        const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        return {
          pilotName: booking.pilot.name,
          pilotPhone: booking.pilot.phone,
          waLink,
        };
      });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Admin whatsapp-notify error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
