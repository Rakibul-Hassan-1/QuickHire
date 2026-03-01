"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string;
  description: string;
  logo: string;
  color: string;
  salary?: string;
  hasApplied: boolean;
  isSaved: boolean;
}

const tagColors: Record<string, { bg: string; color: string }> = {
  Design: { bg: "#eff6ff", color: "#3b82f6" },
  Business: { bg: "#fef3c7", color: "#d97706" },
  Marketing: { bg: "#f0fdf4", color: "#16a34a" },
  Technology: { bg: "#f3e8ff", color: "#7c3aed" },
};

const typeColors: Record<string, { bg: string; color: string; border: string }> = {
  "Full Time": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Part Time": { bg: "#fef3c7", color: "#b45309", border: "#fde68a" },
  "Remote": { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
  "Contract": { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const init = async () => {
      const { id } = await params;
      setJobId(id);
      const res = await fetch("/api/jobs/" + id);
      const data = await res.json();
      setJob(data);
      setLoading(false);
    };
    init();
  }, []);

  const handleApply = async () => {
    if (!session) { router.push("/login"); return; }
    setApplying(true);
    const res = await fetch("/api/jobs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ text: "Application submitted successfully!", type: "success" });
      setJob((prev) => prev ? { ...prev, hasApplied: true } : prev);
    } else {
      setMessage({ text: data.error, type: "error" });
    }
    setApplying(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleSave = async () => {
    if (!session) { router.push("/login"); return; }
    setSaving(true);
    const res = await fetch("/api/jobs/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    const data = await res.json();
    if (res.ok) {
      setJob((prev) => prev ? { ...prev, isSaved: data.saved } : prev);
      setMessage({ text: data.saved ? "Job saved to your profile" : "Job removed from saved", type: "success" });
    }
    setSaving(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "DM Sans, sans-serif" }}>
        <div style={{ background: "white", height: "64px", borderBottom: "1px solid #f1f5f9" }} />
        <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
          <div>
            <div style={{ background: "white", borderRadius: "16px", padding: "32px", animation: "pulse 1.5s infinite" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "#f1f5f9", marginBottom: "20px" }} />
              <div style={{ width: "60%", height: "24px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "12px" }} />
              <div style={{ width: "40%", height: "16px", background: "#f1f5f9", borderRadius: "6px" }} />
            </div>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", height: "200px", animation: "pulse 1.5s infinite" }} />
        </div>
      </div>
    </>
  );

  if (!job) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      Job not found.
    </div>
  );

  const tc = typeColors[job.type] ?? { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .nav { background: white; padding: 0 60px; display: flex; justify-content: space-between; align-items: center; height: 64px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 100; }
        .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-icon { width: 34px; height: 34px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; font-family: 'Playfair Display', serif; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #0f172a; font-weight: 700; }
        .back-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: none; color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; margin-bottom: 24px; transition: color 0.2s; }
        .back-btn:hover { color: #0f172a; }
        .main-card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #f1f5f9; margin-bottom: 20px; }
        .company-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 24px; }
        .company-logo { width: 64px; height: 64px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 22px; font-family: 'Playfair Display', serif; flex-shrink: 0; }
        .job-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 6px; line-height: 1.2; }
        .company-name { font-size: 16px; color: #475569; font-weight: 500; }
        .meta-row { display: flex; gap: 20px; flex-wrap: wrap; padding: 20px 0; border-top: 1px solid #f8fafc; border-bottom: 1px solid #f8fafc; margin-bottom: 20px; }
        .meta-item { display: flex; align-items: center; gap: 8px; }
        .meta-label { font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .meta-value { font-size: 14px; color: #1e293b; font-weight: 600; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
        .desc-text { color: #475569; font-size: 15px; line-height: 1.8; font-weight: 300; }
        .req-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .req-item { display: flex; align-items: flex-start; gap: 10px; color: #475569; font-size: 14px; line-height: 1.5; }
        .req-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; flex-shrink: 0; margin-top: 7px; }
        .offer-grid { display: grid; gridTemplateColumns: 1fr 1fr; gap: 12px; }
        .offer-item { display: flex; align-items: center; gap: 10px; padding: 12px; background: #f8fafc; borderRadius: 8px; font-size: 14px; color: #374151; }
        .sidebar-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; position: sticky; top: 84px; }
        .apply-btn { width: 100%; padding: 14px; background: #0f172a; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; margin-bottom: 10px; }
        .apply-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .apply-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        .save-btn { width: 100%; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; margin-bottom: 24px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
        .detail-label { font-size: 12px; color: #94a3b8; font-weight: 500; }
        .detail-value { font-size: 13px; color: #374151; font-weight: 600; }
        .msg-box { border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .tag { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
        @media (max-width: 768px) { .nav { padding: 0 20px; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <nav className="nav">
          <div className="nav-brand" onClick={() => router.push("/")}>
            <div className="nav-icon">Q</div>
            <span className="nav-name">QuickHire</span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => router.push("/jobs")} style={{ background: "transparent", border: "1.5px solid #e2e8f0", color: "#374151", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
              All Jobs
            </button>
            {session ? (
              <button onClick={() => router.push("/dashboard")} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                Dashboard
              </button>
            ) : (
              <button onClick={() => router.push("/login")} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                Sign In
              </button>
            )}
          </div>
        </nav>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px" }}>
          <button className="back-btn" onClick={() => router.push("/jobs")}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Jobs
          </button>

          {message.text && (
            <div className="msg-box" style={{ background: message.type === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`, color: message.type === "success" ? "#15803d" : "#dc2626" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {message.type === "success"
                  ? <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  : <><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></>}
              </svg>
              {message.text}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", alignItems: "start" }}>
            <div>
              {/* Header */}
              <div className="main-card">
                <div className="company-header">
                  <div className="company-logo" style={{ background: job.color }}>{job.logo}</div>
                  <div>
                    <h1 className="job-title">{job.title}</h1>
                    <div className="company-name">{job.company}</div>
                  </div>
                  <span style={{ marginLeft: "auto", background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "20px", flexShrink: 0 }}>
                    {job.type}
                  </span>
                </div>

                <div className="meta-row">
                  <div className="meta-item">
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    </svg>
                    <div>
                      <div className="meta-label">Location</div>
                      <div className="meta-value">{job.location}</div>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="meta-item">
                      <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      <div>
                        <div className="meta-label">Salary</div>
                        <div className="meta-value" style={{ color: "#059669" }}>{job.salary}</div>
                      </div>
                    </div>
                  )}
                  <div className="meta-item">
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
                    </svg>
                    <div>
                      <div className="meta-label">Job Type</div>
                      <div className="meta-value">{job.type}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginLeft: "auto" }}>
                    {job.tags.split(",").map((tag) => {
                      const tc2 = tagColors[tag.trim()] ?? { bg: "#f8fafc", color: "#64748b" };
                      return <span key={tag} className="tag" style={{ background: tc2.bg, color: tc2.color }}>{tag.trim()}</span>;
                    })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="main-card">
                <h2 className="section-title">About the Role</h2>
                <p className="desc-text" style={{ marginBottom: "28px" }}>{job.description}</p>

                <h2 className="section-title">Requirements</h2>
                <ul className="req-list" style={{ marginBottom: "28px" }}>
                  {["3+ years of relevant professional experience", "Strong communication and collaborative mindset", "Proficiency in industry-standard tools and technologies", "Bachelor's degree or equivalent practical experience", "Proven ability to deliver in fast-paced environments"].map((r) => (
                    <li key={r} className="req-item">
                      <div className="req-dot" />
                      {r}
                    </li>
                  ))}
                </ul>

                <h2 className="section-title">What We Offer</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { icon: "💰", text: "Competitive salary & equity" },
                    { icon: "🏥", text: "Health, dental & vision" },
                    { icon: "🌍", text: "Flexible & remote options" },
                    { icon: "📚", text: "Learning budget $2,000/yr" },
                    { icon: "🏖️", text: "Unlimited PTO policy" },
                    { icon: "🤝", text: "Inclusive team culture" },
                  ].map((o) => (
                    <div key={o.text} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#f8fafc", borderRadius: "10px", fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                      <span>{o.icon}</span> {o.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sidebar-card">
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginFamily: "Playfair Display, serif", marginBottom: "4px" }}>{job.title}</div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>{job.company}</div>
                </div>

                {job.hasApplied ? (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "10px" }}>
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>✅</div>
                    <div style={{ color: "#15803d", fontWeight: 600, fontSize: "14px" }}>Application Submitted</div>
                    <div style={{ color: "#16a34a", fontSize: "12px", marginTop: "4px" }}>Track status in your profile</div>
                  </div>
                ) : (
                  <button className="apply-btn" onClick={handleApply} disabled={applying}>
                    {applying ? "Submitting..." : "Apply Now"}
                  </button>
                )}

                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: job.isSaved ? "#f0fdf4" : "white",
                    color: job.isSaved ? "#15803d" : "#374151",
                    border: `1.5px solid ${job.isSaved ? "#bbf7d0" : "#e2e8f0"}`,
                  }}
                >
                  {job.isSaved ? "✓ Saved" : "Save Position"}
                </button>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "12px" }}>Job Details</div>
                  {[
                    { label: "Company", value: job.company },
                    { label: "Location", value: job.location },
                    { label: "Type", value: job.type },
                    { label: "Salary", value: job.salary ?? "Competitive" },
                  ].map(({ label, value }) => (
                    <div key={label} className="detail-row">
                      <span className="detail-label">{label}</span>
                      <span className="detail-value">{value}</span>
                    </div>
                  ))}
                </div>

                {!session && (
                  <div style={{ marginTop: "16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "13px", color: "#9a3412", marginBottom: "10px", fontWeight: 500 }}>Sign in to apply or save jobs</div>
                    <button onClick={() => router.push("/login")} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "8px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", width: "100%" }}>
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}