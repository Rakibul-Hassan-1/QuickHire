import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();

  const jobs = [
    {
      title: "Email Marketing",
      company: "Revolut",
      location: "Madrid, Spain",
      type: "Full Time",
      tags: "Marketing,Design",
      description:
        "Revolut is looking for an Email Marketing specialist to help the team grow.",
      logo: "R",
      color: "#e11d48",
      salary: "$60k - $80k",
    },
    {
      title: "Brand Designer",
      company: "Dropbox",
      location: "San Francisco, US",
      type: "Full Time",
      tags: "Design,Business",
      description:
        "Dropbox is looking for a Brand Designer to help create stunning visuals.",
      logo: "D",
      color: "#0061ff",
      salary: "$80k - $100k",
    },
    {
      title: "Product Designer",
      company: "ClassPass",
      location: "Manchester, UK",
      type: "Full Time",
      tags: "Design,Marketing",
      description:
        "ClassPass is looking for a Product Designer to improve user experience.",
      logo: "C",
      color: "#7c3aed",
      salary: "$70k - $90k",
    },
    {
      title: "Data Analyst",
      company: "Twitter",
      location: "San Diego, US",
      type: "Full Time",
      tags: "Technology",
      description:
        "Twitter is looking for a Data Analyst to help analyze platform metrics.",
      logo: "T",
      color: "#1da1f2",
      salary: "$90k - $120k",
    },
    {
      title: "Brand Strategist",
      company: "GoDaddy",
      location: "Marseille, France",
      type: "Full Time",
      tags: "Marketing",
      description:
        "GoDaddy is looking for a Brand Strategist to lead marketing campaigns.",
      logo: "G",
      color: "#1d4ed8",
      salary: "$65k - $85k",
    },
    {
      title: "Lead Designer",
      company: "Canva",
      location: "Ontario, Canada",
      type: "Full Time",
      tags: "Design,Business",
      description:
        "Canva is looking for a Lead Designer to drive product design.",
      logo: "Ca",
      color: "#00c4cc",
      salary: "$85k - $110k",
    },
    {
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      type: "Full Time",
      tags: "Marketing,Design",
      description:
        "Nomad is looking for a Social Media Assistant to manage online presence.",
      logo: "N",
      color: "#16a34a",
      salary: "$45k - $60k",
    },
    {
      title: "Interactive Developer",
      company: "Terraform",
      location: "Hamburg, Germany",
      type: "Full Time",
      tags: "Technology,Design",
      description:
        "Terraform is looking for an Interactive Developer to build amazing experiences.",
      logo: "T",
      color: "#0d9488",
      salary: "$95k - $130k",
    },
    {
      title: "HR Manager",
      company: "Packer",
      location: "Lucern, Switzerland",
      type: "Full Time",
      tags: "Business",
      description:
        "Packer is looking for an HR Manager to lead people operations.",
      logo: "P",
      color: "#ea580c",
      salary: "$70k - $90k",
    },
    {
      title: "Visual Designer",
      company: "Blinklist",
      location: "Granada, Spain",
      type: "Part Time",
      tags: "Design",
      description:
        "Blinklist is looking for a Visual Designer to create beautiful interfaces.",
      logo: "B",
      color: "#16a34a",
      salary: "$40k - $55k",
    },
    {
      title: "Engineering Manager",
      company: "Webflow",
      location: "Remote",
      type: "Remote",
      tags: "Technology",
      description:
        "Webflow is looking for an Engineering Manager to lead the dev team.",
      logo: "W",
      color: "#3b82f6",
      salary: "$130k - $160k",
    },
    {
      title: "UX Researcher",
      company: "Maze",
      location: "San Francisco, USA",
      type: "Full Time",
      tags: "Design,Technology",
      description:
        "Maze is looking for a UX Researcher to improve product usability.",
      logo: "M",
      color: "#7c3aed",
      salary: "$80k - $105k",
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log("Seeded", jobs.length, "jobs!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
