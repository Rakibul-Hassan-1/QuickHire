import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please login to apply" }, { status: 401 });

  const { jobId } = await req.json();

  const existing = await prisma.application.findFirst({
    where: { userId: session.user.id, jobId },
  });

  if (existing) return NextResponse.json({ error: "Already applied to this job" }, { status: 400 });

  const application = await prisma.application.create({
    data: { userId: session.user.id, jobId },
  });

  return NextResponse.json(application, { status: 201 });
}
