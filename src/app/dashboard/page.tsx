"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Stats {
  applications: number;
  savedJobs: number;
  accepted: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ applications: 0, savedJobs: 0, accepted: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadStats();
  }, [status]);

  const loadStats = async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setStats({
        applications: data.applications?.length ?? 0,
        savedJobs: data.savedJobs?.length ?? 0,
        accepted: data.applications?.filter((a: any) => a.status === "accepted").length ?? 0,
      });
    }
  };

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", background: "#f8fafc" }}>
      Loading...
    </div>
  );

  if (!session) return null;

  const firstName = session.user.name?.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { title: "Browse Jobs", desc: "Explore new opportunities", icon: "🔍", path: "/jobs", color: "#0f172a", light: "#f8fafc" },
    { title: "My Profile", desc: "Update skills & experience", icon: "👤", path: "/profile", color: "#6366f1", light: "#eef2ff" },
    { title: "Applications", desc: "Track your submissions", icon: "📋", path: "/profile", color: "#0891b2", light: "#ecfeff" },
    { title: "Saved Jobs", desc: "Jobs you bookmarked", icon: "🔖", path: "/profile", color: "#059669", light: "#f0fdf4" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .dash-nav { background: white; padding: 0 60px; display: flex; justify-content: space-between; align-items: center; height: 64px; border-bottom: 1px solid #f1f5f9; }
        .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-icon { width: 34px; height: 34px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #0f172a; font-weight: 700; }
        .nav-right { display: flex; gap: 12px; align-items: center; }
        .nav-user { display: flex; align-items: center; gap: 10px; padding: 6px 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .user-avatar { width: 28px; height: 28px; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 700; }
        .user-name { font-size: 13px; font-weight: 600; color: #374151; }
        .btn-sm { border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost { background: transparent; border: 1.5px solid #e2e8f0; color: #374151; }
        .btn-ghost:hover { background: #f8fafc; }
        .btn-danger { background: transparent; border: 1.5px solid #fecaca; color: #dc2626; }
        .btn-danger:hover { background: #fef2f2; }
        .content { max-width: 1100px; margin: 0 auto; padding: 48px 20px; }
        .welcome-section { margin-bottom: 40px; }
        .greeting { font-size: 13px; color: #94a3b8; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
        .welcome-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .welcome-sub { color: #64748b; font-size: 15px; font-weight: 300; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; }
        .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #64748b; font-weight: 500; }
        .stat-change { font-size: 12px; color: #16a34a; font-weight: 500; margin-top: 6px; }
        .section-head { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
        .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 40px; }
        .action-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 18px; }
        .action-card:hover { border-color: #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .action-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .action-title { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .action-desc { font-size: 13px; color: #94a3b8; }
        .action-arrow { margin-left: auto; color: #cbd5e1; font-size: 18px; transition: transform 0.2s; }
        .action-card:hover .action-arrow { transform: translateX(4px); color: #94a3b8; }
        .info-card { background: white; border-radius: 16px; padding: 28px; border: 1px solid #f1f5f9; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-label { font-size: 13px; color: #94a3b8; font-weight: 500; }
        .info-value { font-size: 14px; color: #1e293b; font-weight: 600; }
        .badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
        @media (max-width: 768px) { .dash-nav { padding: 0 20px; } .stats-row { grid-template-columns: 1fr; } .actions-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <nav className="dash-nav">
          <div className="nav-brand" onClick={() => router.push("/")}>
            <div className="nav-icon">Q</div>
            <span className="nav-name">QuickHire</span>
          </div>
          <div className="nav-right">
            <div className="nav-user">
              <div className="user-avatar">{firstName?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{session.user.name}</span>
            </div>
            <button className="btn-sm btn-ghost" onClick={() => router.push("/jobs")}>Find Jobs</button>
            <button className="btn-sm btn-ghost" onClick={() => router.push("/profile")}>Profile</button>
            <button className="btn-sm btn-danger" onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
          </div>
        </nav>

        <div className="content">
          <div className="welcome-section">
            <div className="greeting">{greeting}</div>
            <h1 className="welcome-title">{firstName}, welcome back.</h1>
            <p className="welcome-sub">Here's an overview of your job search activity.</p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {[
              { icon: "📋", bg: "#eff6ff", num: stats.applications, label: "Total Applications", change: "Keep applying!" },
              { icon: "🔖", bg: "#f0fdf4", num: stats.savedJobs, label: "Saved Positions", change: "Jobs you bookmarked" },
              { icon: "✅", bg: "#ecfdf5", num: stats.accepted, label: "Offers Received", change: stats.accepted > 0 ? "Congratulations!" : "Keep going!" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-change">{s.change}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="section-head">Quick Actions</div>
          <div className="actions-grid">
            {quickActions.map((a) => (
              <div key={a.title} className="action-card" onClick={() => router.push(a.path)}>
                <div className="action-icon" style={{ background: a.light }}>{a.icon}</div>
                <div>
                  <div className="action-title">{a.title}</div>
                  <div className="action-desc">{a.desc}</div>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>

          {/* Account Info */}
          <div className="section-head">Account Information</div>
          <div className="info-card">
            {[
              { label: "Full Name", value: session.user.name },
              { label: "Email Address", value: session.user.email },
              { label: "Account Status", value: <span className="badge" style={{ background: "#dcfce7", color: "#15803d" }}>Active</span> },
              { label: "User ID", value: <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#94a3b8" }}>{session.user.id}</span> },
            ].map(({ label, value }) => (
              <div key={label} className="info-row">
                <span className="info-label">{label}</span>
                <span className="info-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}