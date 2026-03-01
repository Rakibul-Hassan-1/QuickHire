import JobCard from "../components/JobCard";
import { featuredJobs } from "../data/jobs";

export default function FeaturedJobs() {
  return (
    <section
      style={{
        padding: "60px 60px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
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
          Featured <span style={{ color: "#3b82f6" }}>jobs</span>
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
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {featuredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
