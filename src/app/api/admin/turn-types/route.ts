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
    const turnTypes = await prisma.turnType.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(turnTypes);
  } catch (error) {
    console.error("Admin turn-types GET error:", error);
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
    const { name, description, durationMin, defaultPrice, maxPilots, color, sortOrder, features } = body;

    if (!name || durationMin === undefined || defaultPrice === undefined) {
      return NextResponse.json(
        { error: "Nombre, duración y precio son requeridos" },
        { status: 400 }
      );
    }

    const turnType = await prisma.turnType.create({
      data: {
        name,
        description: description ?? null,
        durationMin: parseInt(String(durationMin)),
        defaultPrice: parseFloat(String(defaultPrice)),
        maxPilots: maxPilots ? parseInt(String(maxPilots)) : 10,
        color: color ?? null,
        sortOrder: sortOrder !== undefined ? parseInt(String(sortOrder)) : 0,
        features: features ?? null,
      },
    });

    return NextResponse.json(turnType);
  } catch (error) {
    console.error("Admin turn-types POST error:", error);
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
    if (fields.name !== undefined) updateData.name = fields.name;
    if (fields.description !== undefined) updateData.description = fields.description;
    if (fields.durationMin !== undefined) updateData.durationMin = parseInt(String(fields.durationMin));
    if (fields.defaultPrice !== undefined) updateData.defaultPrice = parseFloat(String(fields.defaultPrice));
    if (fields.maxPilots !== undefined) updateData.maxPilots = parseInt(String(fields.maxPilots));
    if (fields.color !== undefined) updateData.color = fields.color;
    if (fields.sortOrder !== undefined) updateData.sortOrder = parseInt(String(fields.sortOrder));
    if (fields.features !== undefined) updateData.features = fields.features;
    if (fields.isActive !== undefined) updateData.isActive = fields.isActive;

    const turnType = await prisma.turnType.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(turnType);
  } catch (error) {
    console.error("Admin turn-types PATCH error:", error);
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

    const turnType = await prisma.turnType.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(turnType);
  } catch (error) {
    console.error("Admin turn-types DELETE error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
