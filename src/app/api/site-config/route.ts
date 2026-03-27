import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.siteConfig.findMany();
    const config: Record<string, string> = {};
    for (const row of rows) {
      config[row.key] = row.value;
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Site-config GET error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
