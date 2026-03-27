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
    const rows = await prisma.siteConfig.findMany();
    const config: Record<string, string> = {};
    for (const row of rows) {
      config[row.key] = row.value;
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Admin site-config GET error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = getToken(req);
  if (!token || !verifyToken(token)) {
    return unauthorized();
  }

  try {
    const body: Record<string, string> = await req.json();

    const upserts = Object.entries(body).map(([key, value]) =>
      prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(upserts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin site-config PUT error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
