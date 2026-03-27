import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const turnTypes = await prisma.turnType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(turnTypes);
  } catch (error) {
    console.error("Turn-types GET error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
