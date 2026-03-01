"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills?: string;
  experience?: string;
  education?: string;
  applications: Array<{
    id: string;
    status: string;
    createdAt: string;
    job: { id: string; title: string; company: string; location: string; type: string; color: string; logo: string };
  }>;
  savedJobs: Array<{
    id: string;
    job: { id: string; title: string; company: string; location: string; type: string; color: string; logo: string };
  }>;
}

const tabs = ["Overview", "Edit Profile", "Applications", "Saved Jobs", "Password"];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: "#fef3c7", color: "#d97706", label: "Under Review" },
  accepted: { bg: "#dcfce7", color: "#15803d", label: "Accepted" },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "Not Selected" },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({ name: "", bio: "", phone: "", location: "", website: "", linkedin: "", github: "", skills: "", experience: "", education: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadProfile();
  }, [status]);

  const loadProfile = async () => {
    setLoading(true);
    const res = await fetch("/api/profile");
    const data = await res.json();
    setProfile(data);
    setForm({ name: data.name ?? "", bio: data.bio ?? "", phone: data.phone ?? "", location: data.location ?? "", website: data.website ?? "", linkedin: data.linkedin ?? "", github: data.github ?? "", skills: data.skills ?? "", experience: data.experience ?? "", education: data.education ?? "" });
    setLoading(false);
  };

  const showMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { showMessage("Profile updated successfully!", "success"); loadProfile(); }
    else showMessage("Failed to update profile.", "error");
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { showMessage("Passwords do not match", "error"); return; }
    setSaving(true);
    const res = await fetch("/api/profile/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }) });
    const data = await res.json();
    if (res.ok) { showMessage("Password changed successfully!", "success"); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else showMessage(data.error || "Failed.", "error");
    setSaving(false);
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", background: "#f8fafc" }}>Loading...</div>;

  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "DM Sans, sans-serif", outline: "none", color: "#1e293b", background: "white", transition: "border-color 0.2s", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .prof-nav { background: white; padding: 0 60px; display: flex; justify-content: space-between; align-items: center; height: 64px; border-bottom: 1px solid #f1f5f9; }
        .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-icon { width: 34px; height: 34px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #0f172a; font-weight: 700; }
        .nav-right { display: flex; gap: 10px; }
        .btn-sm { border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost { background: transparent; border: 1.5px solid #e2e8f0; color: #374151; }
        .btn-ghost:hover { background: #f8fafc; }
        .btn-danger { background: transparent; border: 1.5px solid #fecaca; color: #dc2626; }
        .content { max-width: 1100px; margin: 0 auto; padding: 40px 20px; display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; }
        .avatar-card { padding: 28px; text-align: center; }
        .avatar { width: 80px; height: 80px; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: white; }
        .prof-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .prof-email { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
        .prof-location { font-size: 13px; color: #6366f1; display: flex; align-items: center; gap: 4px; justify-content: center; }
        .stats-mini { display: grid; grid-template-columns: repeat(3, 1fr); }
        .stat-mini { padding: 16px 8px; text-align: center; border-right: 1px solid #f1f5f9; }
        .stat-mini:last-child { border-right: none; }
        .stat-mini-num { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #0f172a; }
        .stat-mini-label { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .skills-card { padding: 20px; }
        .skills-title { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 12px; }
        .skill-tag { display: inline-block; background: #eff6ff; color: #3b82f6; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; margin: 3px; }
        .tab-bar { display: flex; gap: 2px; background: white; border-radius: 12px; padding: 6px; border: 1px solid #f1f5f9; margin-bottom: 20px; overflow-x: auto; }
        .tab-btn { padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; white-space: nowrap; transition: all 0.2s; }
        .tab-btn.active { background: #0f172a; color: white; }
        .tab-btn:not(.active) { background: transparent; color: #64748b; }
        .tab-btn:not(.active):hover { color: #374151; background: #f8fafc; }
        .panel { background: white; border-radius: 16px; padding: 28px; border: 1px solid #f1f5f9; }
        .panel-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field { margin-bottom: 4px; }
        input:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .save-btn { background: #0f172a; color: white; border: none; border-radius: 10px; padding: 13px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .save-btn:hover { background: #1e293b; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .msg { border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .app-row { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #f1f5f9; border-radius: 12px; margin-bottom: 10px; transition: border-color 0.2s; }
        .app-row:hover { border-color: #e2e8f0; }
        .app-logo { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px; flex-shrink: 0; }
        .app-title { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 3px; }
        .app-sub { font-size: 12px; color: #94a3b8; }
        .status-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
        .empty { text-align: center; padding: 60px 20px; }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 18px; color: #0f172a; margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: #94a3b8; }
        .browse-btn { margin-top: 16px; background: #0f172a; color: white; border: none; border-radius: 8px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .info-section { margin-bottom: 24px; }
        .info-section-title { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .info-item { padding: 12px; background: #f8fafc; border-radius: 10px; }
        .info-item-label { font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 4px; }
        .info-item-value { font-size: 14px; color: #1e293b; font-weight: 500; }
        @media (max-width: 768px) { .prof-nav { padding: 0 20px; } .content { grid-template-columns: 1fr; } .grid-2 { grid-template-columns: 1fr; } .info-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <nav className="prof-nav">
          <div className="nav-brand" onClick={() => router.push("/")}>
            <div className="nav-icon">Q</div>
            <span className="nav-name">QuickHire</span>
          </div>
          <div className="nav-right">
            <button className="btn-sm btn-ghost" onClick={() => router.push("/jobs")}>Find Jobs</button>
            <button className="btn-sm btn-ghost" onClick={() => router.push("/dashboard")}>Dashboard</button>
            <button className="btn-sm btn-danger" onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
          </div>
        </nav>

        <div className="content">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="card avatar-card">
              <div className="avatar">{profile?.name?.charAt(0).toUpperCase()}</div>
              <div className="prof-name">{profile?.name}</div>
              <div className="prof-email">{profile?.email}</div>
              {profile?.location && <div className="prof-location">📍 {profile.location}</div>}
            </div>

            <div className="card">
              <div className="stats-mini">
                <div className="stat-mini">
                  <div className="stat-mini-num">{profile?.applications.length ?? 0}</div>
                  <div className="stat-mini-label">Applied</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-num">{profile?.savedJobs.length ?? 0}</div>
                  <div className="stat-mini-label">Saved</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-num">{profile?.applications.filter(a => a.status === "accepted").length ?? 0}</div>
                  <div className="stat-mini-label">Offers</div>
                </div>
              </div>
            </div>

            {profile?.skills && (
              <div className="card skills-card">
                <div className="skills-title">Skills</div>
                <div>
                  {profile.skills.split(",").map(s => (
                    <span key={s} className="skill-tag">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {(profile?.website || profile?.linkedin || profile?.github) && (
              <div className="card" style={{ padding: "20px" }}>
                <div className="skills-title">Links</div>
                {[
                  { label: "Website", val: profile?.website },
                  { label: "LinkedIn", val: profile?.linkedin },
                  { label: "GitHub", val: profile?.github },
                ].filter(l => l.val).map(l => (
                  <div key={l.label} style={{ marginBottom: "8px" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, marginBottom: "2px" }}>{l.label}</div>
                    <div style={{ fontSize: "13px", color: "#6366f1", fontWeight: 500 }}>{l.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div>
            <div className="tab-bar">
              {tabs.map(t => (
                <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
              ))}
            </div>

            {message.text && (
              <div className="msg" style={{ background: message.type === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`, color: message.type === "success" ? "#15803d" : "#dc2626" }}>
                {message.type === "success" ? "✓" : "✗"} {message.text}
              </div>
            )}

            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="panel">
                <div className="panel-title">Profile Overview</div>
                {profile?.bio && (
                  <div className="info-section">
                    <div className="info-section-title">About</div>
                    <p style={{ color: "#475569", fontSize: "15px", lineHeight: 1.8, fontWeight: 300 }}>{profile.bio}</p>
                  </div>
                )}
                {(profile?.phone || profile?.location || profile?.website) && (
                  <div className="info-section">
                    <div className="info-section-title">Contact</div>
                    <div className="info-grid">
                      {[
                        { label: "Phone", value: profile?.phone },
                        { label: "Location", value: profile?.location },
                        { label: "Website", value: profile?.website },
                        { label: "LinkedIn", value: profile?.linkedin },
                      ].filter(i => i.value).map(({ label, value }) => (
                        <div key={label} className="info-item">
                          <div className="info-item-label">{label}</div>
                          <div className="info-item-value">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {profile?.experience && (
                  <div className="info-section">
                    <div className="info-section-title">Experience</div>
                    <p style={{ color: "#475569", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap", fontWeight: 300 }}>{profile.experience}</p>
                  </div>
                )}
                {profile?.education && (
                  <div className="info-section">
                    <div className="info-section-title">Education</div>
                    <p style={{ color: "#475569", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap", fontWeight: 300 }}>{profile.education}</p>
                  </div>
                )}
                {!profile?.bio && !profile?.phone && !profile?.experience && (
                  <div className="empty">
                    <div className="empty-icon">👤</div>
                    <div className="empty-title">Profile incomplete</div>
                    <div className="empty-sub">Add your info to stand out to recruiters</div>
                    <button className="browse-btn" onClick={() => setActiveTab("Edit Profile")}>Complete Profile</button>
                  </div>
                )}
              </div>
            )}

            {/* Edit Profile */}
            {activeTab === "Edit Profile" && (
              <div className="panel">
                <div className="panel-title">Edit Profile</div>
                <form onSubmit={handleSaveProfile}>
                  <div className="grid-2" style={{ marginBottom: "16px" }}>
                    {[
                      { key: "name", label: "Full Name", placeholder: "John Doe" },
                      { key: "phone", label: "Phone", placeholder: "+1 234 567 890" },
                      { key: "location", label: "Location", placeholder: "New York, USA" },
                      { key: "website", label: "Website", placeholder: "https://yoursite.com" },
                      { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
                      { key: "github", label: "GitHub", placeholder: "github.com/username" },
                    ].map(({ key, label, placeholder }) => (
                      <div className="field" key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input style={inputStyle} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                  <div className="field" style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Bio</label>
                    <textarea style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} placeholder="Tell recruiters about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  </div>
                  <div className="field" style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Skills (comma separated)</label>
                    <input style={inputStyle} placeholder="React, TypeScript, Node.js, Figma" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                  </div>
                  <div className="field" style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Experience</label>
                    <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} placeholder="Senior Developer at XYZ Corp (2022–Present)..." value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                  </div>
                  <div className="field" style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Education</label>
                    <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="BSc Computer Science, MIT (2018–2022)" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
                  </div>
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Applications */}
            {activeTab === "Applications" && (
              <div className="panel">
                <div className="panel-title">My Applications ({profile?.applications.length})</div>
                {profile?.applications.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">No applications yet</div>
                    <div className="empty-sub">Start applying to track your progress here</div>
                    <button className="browse-btn" onClick={() => router.push("/jobs")}>Browse Jobs</button>
                  </div>
                ) : profile?.applications.map(app => {
                  const s = statusStyle[app.status] ?? statusStyle.pending;
                  return (
                    <div key={app.id} className="app-row">
                      <div className="app-logo" style={{ background: app.job.color }}>{app.job.logo}</div>
                      <div style={{ flex: 1 }}>
                        <div className="app-title">{app.job.title}</div>
                        <div className="app-sub">{app.job.company} · {app.job.location}</div>
                      </div>
                      <span className="status-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Saved Jobs */}
            {activeTab === "Saved Jobs" && (
              <div className="panel">
                <div className="panel-title">Saved Positions ({profile?.savedJobs.length})</div>
                {profile?.savedJobs.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🔖</div>
                    <div className="empty-title">No saved jobs</div>
                    <div className="empty-sub">Save jobs to revisit them later</div>
                    <button className="browse-btn" onClick={() => router.push("/jobs")}>Browse Jobs</button>
                  </div>
                ) : profile?.savedJobs.map(saved => (
                  <div key={saved.id} className="app-row">
                    <div className="app-logo" style={{ background: saved.job.color }}>{saved.job.logo}</div>
                    <div style={{ flex: 1 }}>
                      <div className="app-title">{saved.job.title}</div>
                      <div className="app-sub">{saved.job.company} · {saved.job.location}</div>
                    </div>
                    <button onClick={() => router.push("/jobs/" + saved.job.id)} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                      View →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Password */}
            {activeTab === "Password" && (
              <div className="panel">
                <div className="panel-title">Change Password</div>
                <form onSubmit={handleChangePassword} style={{ maxWidth: "420px" }}>
                  {[
                    { key: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                    { key: "newPassword", label: "New Password", placeholder: "Min. 6 characters" },
                    { key: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password" },
                  ].map(({ key, label, placeholder }) => (
                    <div className="field" style={{ marginBottom: "16px" }} key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input type="password" style={inputStyle} placeholder={placeholder} value={(pwForm as any)[key]} onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} required />
                    </div>
                  ))}
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}