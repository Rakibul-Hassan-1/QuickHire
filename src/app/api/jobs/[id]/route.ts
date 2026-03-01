import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  let hasApplied = false;
  let isSaved = false;

  if (session) {
    const application = await prisma.application.findFirst({
      where: { userId: session.user.id, jobId: id },
    });
    const saved = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId: session.user.id, jobId: id } },
    });
    hasApplied = !!application;
    isSaved = !!saved;
  }

  return NextResponse.json({ ...job, hasApplied, isSaved });
}
