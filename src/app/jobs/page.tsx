"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
}

const tagColors: Record<string, { bg: string; color: string }> = {
  Design: { bg: "#eff6ff", color: "#3b82f6" },
  Business: { bg: "#fef3c7", color: "#d97706" },
  Marketing: { bg: "#f0fdf4", color: "#16a34a" },
  Technology: { bg: "#f3e8ff", color: "#7c3aed" },
  Engineering: { bg: "#fff7ed", color: "#ea580c" },
  Finance: { bg: "#ecfdf5", color: "#059669" },
};

const typeColors: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  "Full Time": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Part Time": { bg: "#fef3c7", color: "#b45309", border: "#fde68a" },
  Remote: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
  Contract: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  Internship: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};

function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #f1f5f9",
        animation: "pulse 1.5s infinite",
      }}
    >
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "#f1f5f9",
          }}
        />
        <div
          style={{
            width: "70px",
            height: "24px",
            borderRadius: "20px",
            background: "#f1f5f9",
          }}
        />
      </div>
      <div
        style={{
          width: "70%",
          height: "18px",
          background: "#f1f5f9",
          borderRadius: "6px",
          marginBottom: "10px",
        }}
      />
      <div
        style={{
          width: "45%",
          height: "14px",
          background: "#f1f5f9",
          borderRadius: "6px",
          marginBottom: "8px",
        }}
      />
      <div
        style={{
          width: "55%",
          height: "14px",
          background: "#f1f5f9",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "36px",
          background: "#f1f5f9",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}

function JobsContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [activeType, setActiveType] = useState("All");

  const loadJobs = async (q: string, l: string, t: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("query", q);
    if (l) params.set("location", l);
    if (t) params.set("type", t);
    const res = await fetch("/api/jobs?" + params.toString());
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs("", "", "");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs(query, location, type);
  };

  const handleTypeFilter = (t: string) => {
    setActiveType(t);
    setType(t === "All" ? "" : t);
    loadJobs(query, location, t === "All" ? "" : t);
  };

  const typeFilters = ["All", "Full Time", "Part Time", "Remote", "Contract"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        .jobs-nav { background: white; padding: 0 60px; display: flex; justify-content: space-between; align-items: center; height: 64px; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 100; }
        .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-icon { width: 34px; height: 34px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; font-family: 'Playfair Display', serif; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #0f172a; font-weight: 700; }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-link { color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer; transition: color 0.2s; text-decoration: none; }
        .nav-link:hover, .nav-link.active { color: #0f172a; }
        .nav-actions { display: flex; gap: 12px; align-items: center; }
        .btn-ghost { background: transparent; border: 1.5px solid #e2e8f0; color: #374151; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #cbd5e1; background: #f8fafc; }
        .btn-primary { background: #0f172a; border: none; color: white; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-primary:hover { background: #1e293b; }
        .hero-section { background: #0f172a; padding: 56px 60px; position: relative; overflow: hidden; }
        .hero-section::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%); pointer-events: none; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: 40px; color: white; font-weight: 700; margin-bottom: 8px; position: relative; z-index: 1; }
        .hero-title span { color: #818cf8; }
        .hero-sub { color: #94a3b8; font-size: 16px; margin-bottom: 32px; font-weight: 300; position: relative; z-index: 1; }
        .search-bar { display: flex; gap: 0; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.2); max-width: 800px; position: relative; z-index: 1; }
        .search-input-wrap { display: flex; align-items: center; gap: 10px; flex: 2; padding: 0 20px; border-right: 1px solid #f1f5f9; }
        .search-input { border: none; outline: none; font-size: 15px; font-family: 'DM Sans', sans-serif; color: #1e293b; width: 100%; padding: 16px 0; }
        .search-input::placeholder { color: #94a3b8; }
        .location-wrap { display: flex; align-items: center; gap: 10px; flex: 1; padding: 0 20px; }
        .search-btn { background: #6366f1; color: white; border: none; padding: 0 32px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .search-btn:hover { background: #4f46e5; }
        .content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .filters-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        .type-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .type-btn { padding: 7px 16px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: white; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #64748b; transition: all 0.2s; }
        .type-btn:hover { border-color: #cbd5e1; color: #374151; }
        .type-btn.active { background: #0f172a; color: white; border-color: #0f172a; }
        .results-count { font-size: 14px; color: #64748b; font-weight: 500; }
        .results-count strong { color: #0f172a; }
        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .job-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.25s; }
        .job-card:hover { border-color: #e2e8f0; box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .job-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .job-logo { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px; font-family: 'Playfair Display', serif; }
        .job-title { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 4px; line-height: 1.3; }
        .job-company { font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 8px; }
        .job-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; margin-bottom: 12px; }
        .job-salary { font-size: 13px; color: #059669; font-weight: 600; margin-bottom: 12px; }
        .job-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
        .tags-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
        .tag { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.2px; }
        .view-btn { width: 100%; padding: 11px; background: #f8fafc; color: #1e293b; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; letter-spacing: 0.3px; }
        .view-btn:hover { background: #0f172a; color: white; border-color: #0f172a; }
        .empty-state { text-align: center; padding: 80px 20px; }
        .empty-icon { width: 64px; height: 64px; background: #f8fafc; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .empty-title { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px; font-family: 'Playfair Display', serif; }
        .empty-sub { font-size: 14px; color: #94a3b8; }
        @media (max-width: 768px) { .jobs-nav { padding: 0 20px; } .hero-section { padding: 40px 20px; } .hero-title { font-size: 28px; } .nav-links { display: none; } .search-bar { flex-direction: column; } .search-btn { padding: 14px; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        {/* Navbar */}
        <nav className="jobs-nav">
          <div className="nav-brand" onClick={() => router.push("/")}>
            <div className="nav-icon">Q</div>
            <span className="nav-name">QuickHire</span>
          </div>
          <div className="nav-links">
            <span className="nav-link active">Find Jobs</span>
            <span className="nav-link" onClick={() => router.push("/")}>
              Browse Companies
            </span>
          </div>
          <div className="nav-actions">
            {session ? (
              <>
                <span className="btn-ghost" style={{ cursor: "default" }}>
                  {session.user.name?.split(" ")[0]}
                </span>
                <button
                  className="btn-ghost"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-ghost"
                  onClick={() => router.push("/login")}
                >
                  Sign in
                </button>
                <button
                  className="btn-primary"
                  onClick={() => router.push("/register")}
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <div className="hero-section">
          <h1 className="hero-title">
            Find your next <span>opportunity</span>
          </h1>
          <p className="hero-sub">
            Discover {jobs.length > 0 ? jobs.length + "+" : "thousands of"}{" "}
            curated jobs from the world's best companies
          </p>
          <form onSubmit={handleSearch} className="search-bar">
            <div className="search-input-wrap">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#94a3b8"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, company, or keyword..."
              />
            </div>
            <div className="location-wrap">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#94a3b8"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
              <input
                className="search-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
              />
            </div>
            <button type="submit" className="search-btn">
              Search Jobs
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="content">
          <div className="filters-row">
            <div className="type-filters">
              {typeFilters.map((t) => (
                <button
                  key={t}
                  className={`type-btn ${activeType === t ? "active" : ""}`}
                  onClick={() => handleTypeFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="results-count">
              {loading ? (
                "Searching..."
              ) : (
                <>
                  <strong>{jobs.length}</strong> jobs found
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="jobs-grid">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="#94a3b8"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <div className="empty-title">No jobs found</div>
              <div className="empty-sub">
                Try adjusting your search or filters
              </div>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => {
                const tc = typeColors[job.type] ?? {
                  bg: "#f8fafc",
                  color: "#475569",
                  border: "#e2e8f0",
                };
                return (
                  <div key={job.id} className="job-card">
                    <div className="job-card-header">
                      <div
                        className="job-logo"
                        style={{ background: job.color }}
                      >
                        {job.logo}
                      </div>
                      <span
                        style={{
                          background: tc.bg,
                          color: tc.color,
                          border: `1px solid ${tc.border}`,
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {job.type}
                      </span>
                    </div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-company">{job.company}</div>
                    <div className="job-meta">
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="job-salary">{job.salary}</div>
                    )}
                    <div className="tags-row">
                      {job.tags.split(",").map((tag) => {
                        const tc2 = tagColors[tag.trim()] ?? {
                          bg: "#f8fafc",
                          color: "#64748b",
                        };
                        return (
                          <span
                            key={tag}
                            className="tag"
                            style={{ background: tc2.bg, color: tc2.color }}
                          >
                            {tag.trim()}
                          </span>
                        );
                      })}
                    </div>
                    <button
                      className="view-btn"
                      onClick={() => router.push("/jobs/" + job.id)}
                    >
                      View Position →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
