import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === "admin";
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const jobs = await prisma.job.findMany({ include: { _count: { select: { applications: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const job = await prisma.job.create({ data: body });
  return NextResponse.json(job, { status: 201 });
}
