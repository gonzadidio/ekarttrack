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
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");

    let where = {};
    if (year) {
      const yearNum = parseInt(year);
      where = {
        date: {
          gte: new Date(`${yearNum}-01-01`),
          lt: new Date(`${yearNum + 1}-01-01`),
        },
      };
    }

    const holidays = await prisma.holiday.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return NextResponse.json(holidays);
  } catch (error) {
    console.error("Admin holidays GET error:", error);
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
    const { date, name, isClosed, openTime, closeTime } = body;

    if (!date || !name) {
      return NextResponse.json(
        { error: "Fecha y nombre son requeridos" },
        { status: 400 }
      );
    }

    const holiday = await prisma.holiday.create({
      data: {
        date: new Date(date),
        name,
        isClosed: isClosed !== undefined ? isClosed : true,
        openTime: openTime ?? null,
        closeTime: closeTime ?? null,
      },
    });

    return NextResponse.json(holiday);
  } catch (error) {
    console.error("Admin holidays POST error:", error);
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
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (fields.date !== undefined) updateData.date = new Date(fields.date);
    if (fields.name !== undefined) updateData.name = fields.name;
    if (fields.isClosed !== undefined) updateData.isClosed = fields.isClosed;
    if (fields.openTime !== undefined) updateData.openTime = fields.openTime;
    if (fields.closeTime !== undefined) updateData.closeTime = fields.closeTime;

    const holiday = await prisma.holiday.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(holiday);
  } catch (error) {
    console.error("Admin holidays PATCH error:", error);
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
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    await prisma.holiday.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin holidays DELETE error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
