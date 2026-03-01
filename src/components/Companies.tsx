// import { companies } from "../data/jobs";
import { companies } from "../data/jobs";
export default function Companies() {
  return (
    <section style={{ padding: "40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <p style={{ color: "#888", fontSize: "15px", marginBottom: "20px" }}>Companies we helped grow</p>
      <div style={{ display: "flex", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
        {companies.map((company, i) => (
          <span key={company} style={{ fontSize: i === 2 ? "22px" : "18px", fontWeight: 700, color: "#aaa", letterSpacing: i === 2 ? "3px" : "1px", textTransform: i === 2 ? "uppercase" : "none" }}>
            {company}
          </span>
        ))}
      </div>
    </section>
  );
}
