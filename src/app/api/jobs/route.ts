import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { title: { contains: query } },
            { company: { contains: query } },
            { tags: { contains: query } },
          ],
        } : {},
        location ? { location: { contains: location } } : {},
        type ? { type } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}
