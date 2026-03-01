import { latestJobs } from "../data/jobs";
import { Job } from "../types";

const tagStyles: Record<string, { bg: string; color: string; border: string }> =
  {
    "Full-Time": { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
    Marketing: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    Design: { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
  };

function LatestJobRow({ job }: { job: Job }) {
  return (
    <div
      style={{
        background: "white",
        border: "1.5px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          flexShrink: 0,
          background: job.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        {job.logo}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e" }}>
          {job.role}
        </div>
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>
          {job.company} • {job.location}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {job.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "20px",
                background: tagStyles[tag]?.bg ?? "#f3f4f6",
                color: tagStyles[tag]?.color ?? "#666",
                border: `1px solid ${tagStyles[tag]?.border ?? "#e5e7eb"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LatestJobs() {
  return (
    <section
      style={{ padding: "40px 60px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#1a1a2e",
            margin: 0,
          }}
        >
          Latest <span style={{ color: "#3b82f6" }}>jobs open</span>
        </h2>
        <a
          href="#"
          style={{
            color: "#5b4fe9",
            fontSize: "15px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Show all jobs →
        </a>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {latestJobs.map((job) => (
          <LatestJobRow key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
