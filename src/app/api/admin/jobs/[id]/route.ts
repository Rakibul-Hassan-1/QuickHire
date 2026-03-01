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

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  const body = await req.json();
  const job = await prisma.job.update({ where: { id }, data: body });
  return NextResponse.json(job);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  await prisma.application.deleteMany({ where: { jobId: id } });
  await prisma.savedJob.deleteMany({ where: { jobId: id } });
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
