"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string;
  salary?: string;
  logo: string;
  color: string;
  description: string;
  _count?: { applications: number };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  _count?: { applications: number };
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  job: { title: string; company: string; color: string; logo: string };
}

const tabs = ["Overview", "Jobs", "Post Job", "Applications", "Users"];
const colors = [
  "#0f172a",
  "#6366f1",
  "#e11d48",
  "#0061ff",
  "#7c3aed",
  "#0d9488",
  "#16a34a",
  "#ea580c",
  "#1da1f2",
  "#059669",
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#fef3c7", color: "#d97706" },
  accepted: { bg: "#dcfce7", color: "#15803d" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [searchJobs, setSearchJobs] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    tags: "",
    description: "",
    logo: "",
    color: "#0f172a",
    salary: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, usersRes, appsRes] = await Promise.all([
        fetch("/api/admin/jobs"),
        fetch("/api/admin/users"),
        fetch("/api/admin/applications"),
      ]);

      if (jobsRes.status === 403) {
        router.push("/dashboard");
        return;
      }

      if (!jobsRes.ok || !usersRes.ok || !appsRes.ok) {
        throw new Error("Admin data fetch failed");
      }

      const jobsData = await jobsRes.json();
      const usersData = await usersRes.json();
      const appsData = await appsRes.json();

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (err) {
      console.error("Error loading admin data:", err);
      // showMsg("Failed to load dashboard data", "error"); // uncomment if you want UI feedback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      loadData();
    }
  }, [status, router]);

  const showMsg = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editJob ? `/api/admin/jobs/${editJob.id}` : "/api/admin/jobs";
    const method = editJob ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showMsg(
          editJob ? "Job updated successfully!" : "Job posted successfully!",
          "success",
        );
        setForm({
          title: "",
          company: "",
          location: "",
          type: "Full Time",
          tags: "",
          description: "",
          logo: "",
          color: "#0f172a",
          salary: "",
        });
        setEditJob(null);
        setActiveTab("Jobs");
        await loadData();
      } else {
        showMsg("Failed to save job. Try again.", "error");
      }
    } catch (err) {
      console.error("Post job error:", err);
      showMsg("Something went wrong while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id));
        showMsg("Job deleted successfully.", "success");
      } else {
        showMsg("Failed to delete job.", "error");
      }
    } catch (err) {
      console.error("Delete job error:", err);
      showMsg("Error deleting job.", "error");
    }
  };

  const handleEditJob = (job: Job) => {
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      tags: job.tags,
      description: job.description,
      logo: job.logo,
      color: job.color,
      salary: job.salary ?? "",
    });
    setEditJob(job);
    setActiveTab("Post Job");
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications(
          applications.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a,
          ),
        );
      } else {
        showMsg("Failed to update application status.", "error");
      }
    } catch (err) {
      console.error("Update status error:", err);
      showMsg("Error updating status.", "error");
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchJobs.toLowerCase()) ||
      j.company.toLowerCase().includes(searchJobs.toLowerCase()),
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "DM Sans, sans-serif",
          background: "#f8fafc",
        }}
      >
        Loading Admin Panel...
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    color: "#1e293b",
    background: "white",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#64748b",
    marginBottom: "6px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .admin-nav { background: #0f172a; padding: 0 60px; display: flex; justify-content: space-between; align-items: center; height: 64px; }
        .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-icon { width: 34px; height: 34px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #0f172a; font-weight: 800; font-size: 15px; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 20px; color: white; font-weight: 700; }
        .admin-badge { background: #f59e0b; color: #0f172a; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.5px; }
        .nav-right { display: flex; gap: 10px; align-items: center; }
        .nav-user { color: #94a3b8; font-size: 13px; }
        .btn-nav { border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; border: 1px solid rgba(255,255,255,0.2); color: white; background: transparent; transition: all 0.2s; }
        .btn-nav:hover { background: rgba(255,255,255,0.1); }
        .content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .page-head { margin-bottom: 32px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .page-sub { font-size: 14px; color: #94a3b8; }
        .tab-bar { display: flex; gap: 2px; background: white; border-radius: 12px; padding: 6px; border: 1px solid #f1f5f9; margin-bottom: 28px; width: fit-content; overflow-x: auto; }
        .tab-btn { padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; white-space: nowrap; transition: all 0.2s; }
        .tab-btn.active { background: #0f172a; color: white; }
        .tab-btn:not(.active) { background: transparent; color: #64748b; }
        .tab-btn:not(.active):hover { color: #374151; background: #f8fafc; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: white; border-radius: 14px; padding: 20px; border: 1px solid #f1f5f9; }
        .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 12px; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #0f172a; }
        .stat-label { font-size: 12px; color: #94a3b8; margin-top: 2px; font-weight: 500; }
        .panel { background: white; border-radius: 16px; border: 1px solid #f1f5f9; overflow: hidden; }
        .panel-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f8fafc; }
        .panel-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #0f172a; }
        .panel-body { padding: 20px 24px; }
        .search-input { padding: 9px 14px; border-radius: 8px; border: 1.5px solid #e2e8f0; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; color: #374151; width: 220px; }
        .search-input:focus { border-color: #6366f1; }
        .post-btn { background: #0f172a; color: white; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .post-btn:hover { background: #1e293b; }
        .job-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
        .job-row:last-child { border-bottom: none; }
        .job-logo { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; flex-shrink: 0; font-family: 'Playfair Display', serif; }
        .job-info { flex: 1; }
        .job-title-text { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
        .job-sub { font-size: 12px; color: #94a3b8; }
        .app-count { font-size: 11px; font-weight: 700; background: #eff6ff; color: #3b82f6; padding: 3px 10px; border-radius: 20px; }
        .edit-btn { background: #f8fafc; color: #374151; border: 1px solid #e2e8f0; border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .edit-btn:hover { background: #f1f5f9; }
        .del-btn { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 7px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .del-btn:hover { background: #fee2e2; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .save-btn { background: #0f172a; color: white; border: none; border-radius: 10px; padding: 13px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .save-btn:hover { background: #1e293b; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-btn { background: #f8fafc; color: #374151; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .app-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
        .app-row:last-child { border-bottom: none; }
        .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .status-select { padding: 6px 12px; border-radius: 8px; border: 1.5px solid #e2e8f0; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; outline: none; }
        .user-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
        .user-row:last-child { border-bottom: none; }
        .role-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
        .msg { border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .color-dot { width: 28px; height: 28px; border-radius: 6px; cursor: pointer; flex-shrink: 0; transition: transform 0.15s; }
        .color-dot:hover { transform: scale(1.1); }
        input:focus, textarea:focus, select:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        @media (max-width: 768px) { .admin-nav { padding: 0 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .form-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <nav className="admin-nav">
          <div className="nav-brand" onClick={() => router.push("/")}>
            <div className="nav-icon">Q</div>
            <span className="nav-name">QuickHire</span>
            <span className="admin-badge">ADMIN</span>
          </div>
          <div className="nav-right">
            <span className="nav-user">{session?.user?.name || "Admin"}</span>
            <button
              className="btn-nav"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="btn-nav"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="content">
          <div className="page-head">
            <div className="page-title">Admin Panel</div>
            <div className="page-sub">Manage jobs, applications, and users</div>
          </div>

          {message.text && (
            <div
              className="msg"
              style={{
                background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                color: message.type === "success" ? "#15803d" : "#dc2626",
              }}
            >
              {message.type === "success" ? "✓" : "✗"} {message.text}
            </div>
          )}

          <div className="tab-bar">
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(t);
                  if (t !== "Post Job") {
                    setEditJob(null);
                    setForm({
                      title: "",
                      company: "",
                      location: "",
                      type: "Full Time",
                      tags: "",
                      description: "",
                      logo: "",
                      color: "#0f172a",
                      salary: "",
                    });
                  }
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "Overview" && (
            <>
              <div className="stats-grid">
                {[
                  {
                    icon: "💼",
                    bg: "#eff6ff",
                    num: jobs.length,
                    label: "Total Jobs",
                  },
                  {
                    icon: "📋",
                    bg: "#fdf4ff",
                    num: applications.length,
                    label: "Applications",
                  },
                  {
                    icon: "👥",
                    bg: "#f0fdf4",
                    num: users.length,
                    label: "Registered Users",
                  },
                  {
                    icon: "✅",
                    bg: "#fff7ed",
                    num: applications.filter((a) => a.status === "accepted")
                      .length,
                    label: "Offers Extended",
                  },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-icon" style={{ background: s.bg }}>
                      {s.icon}
                    </div>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div className="panel">
                  <div className="panel-head">
                    <div className="panel-title">Recent Applications</div>
                  </div>
                  <div className="panel-body">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="app-row">
                        <div
                          className="job-logo"
                          style={{
                            background: app.job.color,
                            width: "36px",
                            height: "36px",
                            fontSize: "13px",
                          }}
                        >
                          {app.job.logo}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            {app.user.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {app.job.title}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "20px",
                            background: statusStyle[app.status]?.bg,
                            color: statusStyle[app.status]?.color,
                          }}
                        >
                          {app.status}
                        </span>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "24px",
                          color: "#94a3b8",
                          fontSize: "14px",
                        }}
                      >
                        No applications yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <div className="panel-title">Recent Users</div>
                  </div>
                  <div className="panel-body">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="user-row">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            {user.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {user.email}
                          </div>
                        </div>
                        <span
                          className="role-badge"
                          style={{
                            background:
                              user.role === "admin" ? "#fef3c7" : "#f0fdf4",
                            color:
                              user.role === "admin" ? "#d97706" : "#16a34a",
                          }}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Jobs Tab */}
          {activeTab === "Jobs" && (
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">All Jobs ({jobs.length})</div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    className="search-input"
                    placeholder="Search jobs..."
                    value={searchJobs}
                    onChange={(e) => setSearchJobs(e.target.value)}
                  />
                  <button
                    className="post-btn"
                    onClick={() => setActiveTab("Post Job")}
                  >
                    + Post Job
                  </button>
                </div>
              </div>
              <div className="panel-body">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="job-row">
                    <div className="job-logo" style={{ background: job.color }}>
                      {job.logo}
                    </div>
                    <div className="job-info">
                      <div className="job-title-text">{job.title}</div>
                      <div className="job-sub">
                        {job.company} · {job.location} · {job.type}
                      </div>
                    </div>
                    <span className="app-count">
                      {job._count?.applications ?? 0} apps
                    </span>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditJob(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="del-btn"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {filteredJobs.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#94a3b8",
                    }}
                  >
                    No jobs found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Post Job Tab */}
          {activeTab === "Post Job" && (
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  {editJob ? "Edit Job" : "Post New Job"}
                </div>
              </div>
              <div className="panel-body">
                <form onSubmit={handlePostJob}>
                  <div className="form-grid">
                    <div>
                      <label style={labelStyle}>Job Title *</label>
                      <input
                        style={inputStyle}
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="e.g. Senior UX Designer"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Company *</label>
                      <input
                        style={inputStyle}
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                        placeholder="e.g. Google"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Location *</label>
                      <input
                        style={inputStyle}
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        placeholder="e.g. New York, USA"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Job Type *</label>
                      <select
                        style={inputStyle}
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                      >
                        {[
                          "Full Time",
                          "Part Time",
                          "Remote",
                          "Contract",
                          "Internship",
                        ].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Salary Range</label>
                      <input
                        style={inputStyle}
                        value={form.salary}
                        onChange={(e) =>
                          setForm({ ...form, salary: e.target.value })
                        }
                        placeholder="e.g. $80k - $120k"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Tags (comma separated) *</label>
                      <input
                        style={inputStyle}
                        value={form.tags}
                        onChange={(e) =>
                          setForm({ ...form, tags: e.target.value })
                        }
                        placeholder="Design,Technology"
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Logo Text *</label>
                      <input
                        style={inputStyle}
                        value={form.logo}
                        onChange={(e) =>
                          setForm({ ...form, logo: e.target.value })
                        }
                        placeholder="G"
                        maxLength={3}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Logo Color *</label>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginTop: "4px",
                        }}
                      >
                        {colors.map((c) => (
                          <div
                            key={c}
                            className="color-dot"
                            style={{
                              background: c,
                              border:
                                form.color === c
                                  ? "3px solid #0f172a"
                                  : "3px solid transparent",
                              outline:
                                form.color === c ? "2px solid white" : "none",
                            }}
                            onClick={() => setForm({ ...form, color: c })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                      style={{
                        ...inputStyle,
                        minHeight: "100px",
                        resize: "vertical",
                      }}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Describe the role and responsibilities..."
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editJob
                          ? "Update Job"
                          : "Post Job"}
                    </button>
                    {editJob && (
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setEditJob(null);
                          setForm({
                            title: "",
                            company: "",
                            location: "",
                            type: "Full Time",
                            tags: "",
                            description: "",
                            logo: "",
                            color: "#0f172a",
                            salary: "",
                          });
                          setActiveTab("Jobs");
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "Applications" && (
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  All Applications ({applications.length})
                </div>
              </div>
              <div className="panel-body">
                {applications.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      color: "#94a3b8",
                    }}
                  >
                    No applications yet
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="app-row">
                      <div
                        className="job-logo"
                        style={{
                          background: app.job.color,
                          width: "40px",
                          height: "40px",
                          fontSize: "14px",
                        }}
                      >
                        {app.job.logo}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {app.user.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {app.user.email}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          {app.job.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {app.job.company}
                        </div>
                      </div>
                      <select
                        className="status-select"
                        value={app.status}
                        onChange={(e) =>
                          handleUpdateStatus(app.id, e.target.value)
                        }
                        style={{
                          color: statusStyle[app.status]?.color,
                          background: statusStyle[app.status]?.bg,
                          borderColor: "transparent",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "Users" && (
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">All Users ({users.length})</div>
              </div>
              <div className="panel-body">
                {users.map((user) => (
                  <div key={user.id} className="user-row">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {user.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {user.email}
                      </div>
                    </div>
                    <span
                      className="role-badge"
                      style={{
                        background:
                          user.role === "admin" ? "#fef3c7" : "#f0fdf4",
                        color: user.role === "admin" ? "#d97706" : "#16a34a",
                      }}
                    >
                      {user.role.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#7c3aed",
                        background: "#f3e8ff",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontWeight: 700,
                      }}
                    >
                      {user._count?.applications ?? 0} apps
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
