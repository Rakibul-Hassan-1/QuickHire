"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const featuredJobs = [
  { logo: "D", color: "#0061ff", title: "Brand Designer", company: "Dropbox", location: "San Francisco, US", type: "Full Time", salary: "$80k–$100k", tags: ["Design", "Business"] },
  { logo: "W", color: "#3b82f6", title: "Engineering Manager", company: "Webflow", location: "Remote", type: "Remote", salary: "$130k–$160k", tags: ["Technology"] },
  { logo: "Ca", color: "#00c4cc", title: "Lead Designer", company: "Canva", location: "Ontario, Canada", type: "Full Time", salary: "$85k–$110k", tags: ["Design"] },
];

const companies = [
  { name: "Google", logo: "G", color: "#4285f4" },
  { name: "Apple", logo: "A", color: "#000000" },
  { name: "Microsoft", logo: "M", color: "#00a4ef" },
  { name: "Notion", logo: "N", color: "#191919" },
  { name: "Figma", logo: "F", color: "#f24e1e" },
  { name: "Stripe", logo: "S", color: "#635bff" },
];

const categories = [
  { icon: "💻", label: "Technology", count: "1,240 jobs" },
  { icon: "🎨", label: "Design", count: "843 jobs" },
  { icon: "📈", label: "Marketing", count: "621 jobs" },
  { icon: "💼", label: "Business", count: "534 jobs" },
  { icon: "💰", label: "Finance", count: "412 jobs" },
  { icon: "🏥", label: "Healthcare", count: "389 jobs" },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  Design: { bg: "#eff6ff", color: "#3b82f6" },
  Business: { bg: "#fef3c7", color: "#d97706" },
  Marketing: { bg: "#f0fdf4", color: "#16a34a" },
  Technology: { bg: "#f3e8ff", color: "#7c3aed" },
};

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (location) params.set("location", location);
    router.push("/jobs?" + params.toString());
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; color: #1e293b; background: white; }
        .nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid #f1f5f9; padding: 0 80px; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-icon { width: 36px; height: 36px; background: #0f172a; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #0f172a; font-weight: 700; }
        .nav-links { display: flex; gap: 36px; }
        .nav-link { font-size: 14px; color: #64748b; font-weight: 500; cursor: pointer; transition: color 0.2s; }
        .nav-link:hover { color: #0f172a; }
        .nav-actions { display: flex; gap: 12px; align-items: center; }
        .btn-outline { background: transparent; border: 1.5px solid #e2e8f0; color: #374151; border-radius: 9px; padding: 9px 20px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-outline:hover { border-color: #0f172a; color: #0f172a; }
        .btn-dark { background: #0f172a; border: none; color: white; border-radius: 9px; padding: 9px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-dark:hover { background: #1e293b; }
        .hero { background: #0f172a; padding: 100px 80px 80px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -150px; right: -150px; width: 700px; height: 700px; background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%); pointer-events: none; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 20px; padding: 6px 16px; margin-bottom: 28px; }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #818cf8; }
        .hero-eyebrow-text { font-size: 13px; color: #a5b4fc; font-weight: 500; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: 62px; color: white; font-weight: 800; line-height: 1.1; margin-bottom: 20px; position: relative; z-index: 1; }
        .hero-accent { color: #818cf8; font-style: italic; }
        .hero-sub { color: #94a3b8; font-size: 18px; line-height: 1.7; margin-bottom: 48px; font-weight: 300; max-width: 560px; position: relative; z-index: 1; }
        .search-card { background: white; border-radius: 16px; padding: 8px; display: flex; max-width: 700px; position: relative; z-index: 1; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .search-field { display: flex; align-items: center; gap: 10px; padding: 12px 20px; flex: 1; }
        .search-divider { width: 1px; background: #f1f5f9; margin: 8px 0; }
        .s-input { border: none; outline: none; font-size: 15px; font-family: 'DM Sans', sans-serif; color: #1e293b; width: 100%; background: transparent; }
        .s-input::placeholder { color: #94a3b8; }
        .search-btn { background: #0f172a; color: white; border: none; border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
        .search-btn:hover { background: #1e293b; }
        .hero-tags { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; position: relative; z-index: 1; align-items: center; }
        .hero-tag { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 13px; padding: 6px 14px; border-radius: 20px; cursor: pointer; transition: all 0.2s; }
        .hero-tag:hover { background: rgba(255,255,255,0.1); color: white; }
        .hero-stats { display: flex; gap: 40px; margin-top: 56px; position: relative; z-index: 1; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.06); }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 28px; color: white; font-weight: 700; }
        .stat-label { font-size: 13px; color: #64748b; margin-top: 2px; }
        .companies-sec { padding: 56px 80px; border-bottom: 1px solid #f8fafc; }
        .eyebrow { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 28px; text-align: center; }
        .companies-row { display: flex; gap: 16px; justify-content: center; align-items: center; flex-wrap: wrap; }
        .co-chip { display: flex; align-items: center; gap: 10px; padding: 10px 20px; border: 1.5px solid #f1f5f9; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .co-chip:hover { border-color: #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .co-logo { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 12px; }
        .co-name { font-size: 14px; font-weight: 600; color: #374151; }
        .cats-sec { padding: 80px; background: #f8fafc; }
        .sec-inner { max-width: 1100px; margin: 0 auto; }
        .sec-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .sec-sub { font-size: 16px; color: #64748b; font-weight: 300; margin-bottom: 40px; }
        .cats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .cat-card { background: white; border-radius: 14px; padding: 22px; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 14px; }
        .cat-card:hover { border-color: #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .cat-icon { font-size: 26px; }
        .cat-label { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
        .cat-count { font-size: 12px; color: #94a3b8; }
        .cat-arrow { margin-left: auto; color: #e2e8f0; font-size: 16px; transition: all 0.2s; }
        .cat-card:hover .cat-arrow { transform: translateX(4px); color: #94a3b8; }
        .featured-sec { padding: 80px; }
        .sec-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
        .view-all { font-size: 14px; color: #6366f1; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .view-all:hover { color: #4f46e5; }
        .jobs-list { display: flex; flex-direction: column; gap: 10px; }
        .job-item { display: flex; align-items: center; gap: 18px; padding: 20px 24px; background: white; border: 1px solid #f1f5f9; border-radius: 14px; cursor: pointer; transition: all 0.25s; }
        .job-item:hover { border-color: #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-1px); }
        .j-logo { width: 52px; height: 52px; border-radius: 13px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 18px; flex-shrink: 0; font-family: 'Playfair Display', serif; }
        .j-title { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .j-sub { font-size: 13px; color: #94a3b8; }
        .j-salary { font-size: 14px; color: #059669; font-weight: 600; margin-left: auto; white-space: nowrap; padding: 0 16px; }
        .j-tag { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
        .j-btn { background: #f8fafc; color: #0f172a; border: 1.5px solid #e2e8f0; border-radius: 9px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .j-btn:hover { background: #0f172a; color: white; border-color: #0f172a; }
        .cta-sec { background: #0f172a; padding: 80px; position: relative; overflow: hidden; }
        .cta-sec::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); pointer-events: none; }
        .cta-inner { max-width: 600px; position: relative; z-index: 1; }
        .cta-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: white; line-height: 1.2; margin-bottom: 16px; }
        .cta-sub { color: #94a3b8; font-size: 16px; font-weight: 300; margin-bottom: 32px; line-height: 1.7; }
        .cta-btns { display: flex; gap: 14px; }
        .btn-white { background: white; color: #0f172a; border: none; border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-white:hover { background: #f8fafc; }
        .btn-ghost-w { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.25); border-radius: 10px; padding: 14px 28px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost-w:hover { border-color: rgba(255,255,255,0.5); }
        .footer { background: #020617; padding: 36px 80px; display: flex; justify-content: space-between; align-items: center; }
        .footer-brand { font-family: 'Playfair Display', serif; font-size: 20px; color: white; font-weight: 700; }
        .footer-copy { font-size: 13px; color: #334155; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 13px; color: #334155; cursor: pointer; transition: color 0.2s; }
        .footer-link:hover { color: #94a3b8; }
        @media (max-width: 768px) {
          .nav { padding: 0 20px; } .nav-links { display: none; }
          .hero { padding: 60px 20px 50px; } .hero-title { font-size: 36px; }
          .search-card { flex-direction: column; } .search-divider { display: none; width: 0; }
          .hero-stats { gap: 20px; flex-wrap: wrap; }
          .companies-sec { padding: 40px 20px; }
          .cats-sec { padding: 60px 20px; } .cats-grid { grid-template-columns: 1fr; }
          .featured-sec { padding: 60px 20px; }
          .job-item { flex-wrap: wrap; } .j-salary { margin-left: 0; }
          .cta-sec { padding: 60px 20px; } .cta-btns { flex-direction: column; }
          .footer { padding: 28px 20px; flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand" onClick={() => router.push("/")}>
          <div className="nav-icon">Q</div>
          <span className="nav-name">QuickHire</span>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => router.push("/jobs")}>Find Jobs</span>
          <span className="nav-link">Companies</span>
          <span className="nav-link">Salary Guide</span>
        </div>
        <div className="nav-actions">
          {session ? (
            <>
              <button className="btn-outline" onClick={() => router.push("/dashboard")}>Dashboard</button>
              <button className="btn-dark" onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => router.push("/login")}>Sign in</button>
              <button className="btn-dark" onClick={() => router.push("/register")}>Get started free</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">
          <div className="hero-dot" />
          <span className="hero-eyebrow-text">5,000+ jobs from top companies</span>
        </div>
        <h1 className="hero-title">
          Find the career<br />you <span className="hero-accent">deserve</span>
        </h1>
        <p className="hero-sub">
          Connect with world-class companies and land your dream role. Thousands of professionals found their next opportunity here.
        </p>
        <form className="search-card" onSubmit={handleSearch}>
          <div className="search-field">
            <svg width="18" height="18" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input className="s-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Job title, company, or keyword..." />
          </div>
          <div className="search-divider" />
          <div className="search-field" style={{ flex: "0.6" }}>
            <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <input className="s-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location..." />
          </div>
          <button type="submit" className="search-btn">Search Jobs</button>
        </form>
        <div className="hero-tags">
          <span style={{ fontSize: "13px", color: "#475569" }}>Popular:</span>
          {["Remote", "Design", "Engineering", "Product", "Finance"].map(t => (
            <span key={t} className="hero-tag" onClick={() => router.push("/jobs?query=" + t)}>{t}</span>
          ))}
        </div>
        <div className="hero-stats">
          {[{ num: "5,000+", label: "Active Jobs" }, { num: "1,200+", label: "Companies" }, { num: "50k+", label: "Job Seekers" }, { num: "98%", label: "Success Rate" }].map(s => (
            <div key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANIES */}
      <section className="companies-sec">
        <div className="eyebrow">Trusted by professionals at</div>
        <div className="companies-row">
          {companies.map(c => (
            <div key={c.name} className="co-chip">
              <div className="co-logo" style={{ background: c.color }}>{c.logo}</div>
              <span className="co-name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="cats-sec">
        <div className="sec-inner">
          <div className="sec-title">Browse by category</div>
          <div className="sec-sub">Find the perfect role in your field of expertise</div>
          <div className="cats-grid">
            {categories.map(cat => (
              <div key={cat.label} className="cat-card" onClick={() => router.push("/jobs?query=" + cat.label)}>
                <span className="cat-icon">{cat.icon}</span>
                <div>
                  <div className="cat-label">{cat.label}</div>
                  <div className="cat-count">{cat.count}</div>
                </div>
                <span className="cat-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="featured-sec">
        <div className="sec-inner">
          <div className="sec-head">
            <div>
              <div className="sec-title">Featured positions</div>
              <div className="sec-sub" style={{ marginBottom: 0 }}>Handpicked roles from top employers</div>
            </div>
            <span className="view-all" onClick={() => router.push("/jobs")}>View all jobs →</span>
          </div>
          <div className="jobs-list">
            {featuredJobs.map(job => (
              <div key={job.title} className="job-item" onClick={() => router.push("/jobs")}>
                <div className="j-logo" style={{ background: job.color }}>{job.logo}</div>
                <div style={{ flex: 1 }}>
                  <div className="j-title">{job.title}</div>
                  <div className="j-sub">{job.company} · {job.location}</div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {job.tags.map(tag => {
                    const tc = tagColors[tag] ?? { bg: "#f8fafc", color: "#64748b" };
                    return <span key={tag} className="j-tag" style={{ background: tc.bg, color: tc.color }}>{tag}</span>;
                  })}
                </div>
                <div className="j-salary">{job.salary}</div>
                <button className="j-btn" onClick={e => { e.stopPropagation(); router.push("/jobs"); }}>View Position</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-inner">
          <div className="cta-title">Ready to find your next opportunity?</div>
          <p className="cta-sub">Join over 50,000 professionals who use QuickHire to advance their careers. Create your free profile today.</p>
          <div className="cta-btns">
            <button className="btn-white" onClick={() => router.push("/register")}>Create free account</button>
            <button className="btn-ghost-w" onClick={() => router.push("/jobs")}>Browse all jobs</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">QuickHire</div>
        <div className="footer-links">
          {["About", "Privacy", "Terms", "Contact"].map(l => (
            <span key={l} className="footer-link">{l}</span>
          ))}
        </div>
        <div className="footer-copy">© 2026 QuickHire. All rights reserved.</div>
      </footer>
    </>
  );
}