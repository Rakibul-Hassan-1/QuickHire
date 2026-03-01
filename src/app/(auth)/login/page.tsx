"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [focused, setFocused] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        .login-wrap { display: flex; min-height: 100vh; }
        .login-left {
          flex: 1;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; color: white; font-size: 18px;
        }
        .brand-name { font-family: 'Playfair Display', serif; font-size: 22px; color: white; font-weight: 700; }
        .left-content { position: relative; z-index: 1; }
        .left-title {
          font-family: 'Playfair Display', serif;
          font-size: 44px;
          color: white;
          line-height: 1.2;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .left-title span { color: #818cf8; }
        .left-desc { color: #94a3b8; font-size: 16px; line-height: 1.7; margin-bottom: 40px; font-weight: 300; }
        .stat-row { display: flex; gap: 32px; }
        .stat { }
        .stat-num { font-size: 28px; font-weight: 600; color: white; font-family: 'Playfair Display', serif; }
        .stat-label { font-size: 13px; color: #64748b; margin-top: 2px; }
        .left-footer { color: #475569; font-size: 13px; }
        .login-right {
          width: 480px;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }
        .form-box { width: 100%; }
        .form-title { font-family: 'Playfair Display', serif; font-size: 30px; color: #0f172a; font-weight: 700; margin-bottom: 6px; }
        .form-sub { color: #64748b; font-size: 14px; margin-bottom: 32px; }
        .form-sub a { color: #6366f1; font-weight: 500; text-decoration: none; cursor: pointer; }
        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 16px;
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .field { margin-bottom: 18px; }
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
          letter-spacing: 0.3px;
        }
        .field input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          background: white;
          color: #1e293b;
          transition: all 0.2s;
        }
        .field input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
          letter-spacing: 0.3px;
        }
        .submit-btn:hover { background: #0f172a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .divider-text { color: #94a3b8; font-size: 12px; font-weight: 500; white-space: nowrap; }
        .oauth-row { display: flex; gap: 12px; }
        .oauth-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          transition: all 0.2s;
        }
        .oauth-btn:hover { border-color: #cbd5e1; background: #f8fafc; transform: translateY(-1px); }
        .demo-note { margin-top: 20px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 12px; color: #15803d; }
        .demo-note strong { font-weight: 600; }
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; }
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">Q</div>
            <span className="brand-name">QuickHire</span>
          </div>

          <div className="left-content">
            <h1 className="left-title">
              Find the job<br />you <span>deserve</span>
            </h1>
            <p className="left-desc">
              Join thousands of professionals who found their dream careers through QuickHire. Your next opportunity is just one application away.
            </p>
            <div className="stat-row">
              <div className="stat">
                <div className="stat-num">5,000+</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat">
                <div className="stat-num">1,200+</div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="stat">
                <div className="stat-num">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="left-footer">
            &copy; 2026 QuickHire. All rights reserved.
          </div>
        </div>

        <div className="login-right">
          <div className="form-box">
            <h2 className="form-title">Welcome back</h2>
            <p className="form-sub">
              No account?{" "}
              <a onClick={() => router.push("/register")}>Create one free</a>
            </p>

            {error && (
              <div className="error-box">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <div className="oauth-row">
              <button className="oauth-btn" onClick={() => handleOAuth("google")}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.4 35.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C36.9 36.9 44 31 44 24c0-1.3-.1-2.6-.4-3.9z"/>
                </svg>
                Google
              </button>
              <button className="oauth-btn" onClick={() => handleOAuth("github")}>
                <svg width="18" height="18" fill="#333" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.9 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.68.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with email</span>
              <div className="divider-line" />
            </div>

            <form onSubmit={handleCredentials}>
              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in to QuickHire"}
              </button>
            </form>

            <div className="demo-note">
              <strong>Demo:</strong> demo@quickhire.com / password123
            </div>
          </div>
        </div>
      </div>
    </>
  );
}