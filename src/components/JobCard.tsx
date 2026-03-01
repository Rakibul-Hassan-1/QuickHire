import { Job } from "../types";

const tagColors: Record<string, { bg: string; color: string }> = {
  Design: { bg: "#eff6ff", color: "#3b82f6" },
  Business: { bg: "#fef3c7", color: "#f59e0b" },
  Marketing: { bg: "#f0fdf4", color: "#16a34a" },
  Technology: { bg: "#f0fdf4", color: "#16a34a" },
  "Full-Time": { bg: "#f1f5f9", color: "#64748b" },
};

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div
      style={{
        background: "white",
        border: "1.5px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: job.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
            flexShrink: 0,
          }}
        >
          {job.logo}
        </div>
        <span
          style={{
            background: "#eff6ff",
            color: "#3b82f6",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          {job.type}
        </span>
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: "15px",
          color: "#1a1a2e",
          marginBottom: "4px",
        }}
      >
        {job.role}
      </div>
      <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
        {job.company}
      </div>
      <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>
        📍 {job.location}
      </div>
      {job.description && (
        <p
          style={{
            fontSize: "12px",
            color: "#999",
            marginBottom: "12px",
            lineHeight: 1.5,
          }}
        >
          {job.description}
        </p>
      )}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {job.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: "20px",
              background: tagColors[tag]?.bg ?? "#f3f4f6",
              color: tagColors[tag]?.color ?? "#666",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
