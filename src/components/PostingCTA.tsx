export default function PostingCTA() {
  return (
    <section style={{ padding: "20px 60px 80px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #4338ca 0%, #5b4fe9 60%, #3b82f6 100%)", borderRadius: "20px", padding: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", overflow: "hidden", position: "relative" }}>

        {/* Left Content */}
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: "36px", fontWeight: 800, color: "white", margin: "0 0 12px", lineHeight: 1.2 }}>
            Start posting<br />jobs today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", marginBottom: "28px" }}>
            Start posting jobs for only $10.
          </p>
          <button style={{ background: "white", color: "#5b4fe9", border: "none", borderRadius: "8px", padding: "14px 28px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
            Sign Up For Free
          </button>
        </div>

        {/* Right - Dashboard Mockup */}
        <div style={{ zIndex: 1, background: "white", borderRadius: "12px", padding: "16px", width: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontWeight: 600, color: "#333", fontSize: "11px" }}>Hired</span>
            </div>
            <div style={{ background: "#5b4fe9", color: "white", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 600 }}>
              + Post New Job
            </div>
          </div>

          <div style={{ color: "#555", marginBottom: "12px", fontSize: "11px" }}>Good morning, Maria 👋</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
            {[
              { label: "Job Statistics", val: "76", color: "#eff6ff" },
              { label: "Schedule for Today", val: "3", color: "#f0fdf4" },
              { label: "Messages Received", val: "24", color: "#fef9c3" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.color, borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "18px", color: "#1a1a2e" }}>{s.val}</div>
                <div style={{ color: "#666", fontSize: "9px", lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "11px", color: "#333" }}>Job Statistics</span>
              <span style={{ fontSize: "10px", color: "#888" }}>Overview</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", flex: 1 }}>
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}px`, background: i % 2 === 0 ? "#5b4fe9" : "#93c5fd", borderRadius: "3px 3px 0 0" }} />
                ))}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "9px", color: "#888" }}>Job Open</div>
                <div style={{ fontWeight: 800, fontSize: "20px", color: "#1a1a2e" }}>12</div>
                <div style={{ fontSize: "9px", color: "#22c55e" }}>↑ Increased</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", right: "320px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "300px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      </div>
    </section>
  );
}
