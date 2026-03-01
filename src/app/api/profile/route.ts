import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      applications: { include: { job: true }, orderBy: { createdAt: "desc" } },
      savedJobs: { include: { job: true }, orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, bio, phone, location, website, linkedin, github, skills, experience, education } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio, phone, location, website, linkedin, github, skills, experience, education },
  });

  return NextResponse.json(user);
}
