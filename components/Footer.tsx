"use client";
import { useState } from "react";

const footerLinks = {
  About: ["Companies", "Pricing", "Terms", "Advice", "Privacy Policy"],
  Resources: ["Help Docs", "Guide", "Updates", "Contact Us"],
};

const socialIcons = ["f", "ig", "in", "tw", "yt"];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ background: "#1a1a2e", marginTop: "60px", padding: "60px 60px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: "48px", paddingBottom: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>Q</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: "16px", color: "white" }}>QuickHire</span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7, maxWidth: "220px" }}>
              Great platform for the job seeker that passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "white", fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}>{title}</h4>
              {links.map((item) => (
                <a key={item} href="#" style={{ display: "block", color: "#94a3b8", fontSize: "14px", textDecoration: "none", marginBottom: "10px" }}>
                  {item}
                </a>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={{ color: "white", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>Get job notifications</h4>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px", lineHeight: 1.6 }}>
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, padding: "12px 14px", borderRadius: "8px", border: "none", fontSize: "14px", background: "white", color: "#333", outline: "none" }}
              />
              <button style={{ background: "#5b4fe9", color: "white", border: "none", borderRadius: "8px", padding: "12px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748b", fontSize: "13px" }}>2021 © QuickHire. All rights reserved.</span>
          <div style={{ display: "flex", gap: "12px" }}>
            {socialIcons.map((s) => (
              <div key={s} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "11px", cursor: "pointer", fontWeight: 700 }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
