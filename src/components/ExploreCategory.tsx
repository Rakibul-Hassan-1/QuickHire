import { categories } from "../data/jobs";


export default function ExploreCategory() {
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
          Explore by <span style={{ color: "#3b82f6" }}>category</span>
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
        {categories.map((cat) => (
          <div
            key={cat.name}
            style={{
              background: cat.active ? "#5b4fe9" : "white",
              border: cat.active ? "none" : "1.5px solid #e5e7eb",
              borderRadius: "12px",
              padding: "28px 24px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: cat.icon === "</>" ? "22px" : "28px",
                marginBottom: "16px",
                color: cat.active ? "white" : "#5b4fe9",
                fontWeight: 700,
              }}
            >
              {cat.icon}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "16px",
                color: cat.active ? "white" : "#1a1a2e",
                marginBottom: "6px",
              }}
            >
              {cat.name}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: cat.active ? "rgba(255,255,255,0.8)" : "#888",
              }}
            >
              {cat.jobs} jobs available →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
