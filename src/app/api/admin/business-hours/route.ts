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
    const hours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    return NextResponse.json(hours);
  } catch (error) {
    console.error("Admin business-hours GET error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return unauthorized();
  }

  try {
    const body: Array<{
      dayOfWeek: number;
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    }> = await req.json();

    const upserts = body.map((day) =>
      prisma.businessHours.upsert({
        where: { dayOfWeek: day.dayOfWeek },
        update: {
          isOpen: day.isOpen,
          openTime: day.openTime ?? null,
          closeTime: day.closeTime ?? null,
        },
        create: {
          dayOfWeek: day.dayOfWeek,
          isOpen: day.isOpen,
          openTime: day.openTime ?? null,
          closeTime: day.closeTime ?? null,
        },
      })
    );

    await Promise.all(upserts);

    const hours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error("Admin business-hours PUT error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
