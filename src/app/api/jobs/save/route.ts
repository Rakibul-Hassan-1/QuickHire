import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please login to save" }, { status: 401 });

  const { jobId } = await req.json();

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: session.user.id, jobId } },
  });

  if (existing) {
    await prisma.savedJob.delete({ where: { userId_jobId: { userId: session.user.id, jobId } } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedJob.create({ data: { userId: session.user.id, jobId } });
  return NextResponse.json({ saved: true });
}
