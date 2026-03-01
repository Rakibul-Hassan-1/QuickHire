"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { popularTags } from "@/data/jobs";

export default function Hero() {
  const [jobQuery, setJobQuery] = useState("");
  const [location, setLocation] = useState("Florence, Italy");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobQuery) params.set("query", jobQuery);
    if (location) params.set("location", location);
    router.push(`/jobs?${params}`);
  };

  return (
    <section style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "60px 60px 40px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      <div style={{ flex: 1, maxWidth: "520px" }}>
        <h1 style={{ fontSize: "56px", fontWeight: 800, lineHeight: 1.15, color: "#1a1a2e", margin: "0 0 8px" }}>
          Discover<br />more than<br />
          <span style={{ color: "#3b82f6" }}>5000+ Jobs</span>
        </h1>
        <div style={{ width: "280px", height: "6px", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: "4px", marginBottom: "20px" }} />
        <p style={{ color: "#666", fontSize: "16px", lineHeight: 1.6, marginBottom: "36px", maxWidth: "400px" }}>
          Great platform for the job seeker that searching for new career heights and passionate about startups.
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "8px 8px 8px 16px", gap: "8px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <svg width="18" height="18" fill="none" stroke="#999" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" />
            </svg>
            <input type="text" placeholder="Job title or keyword" value={jobQuery} onChange={(e) => setJobQuery(e.target.value)} style={{ border: "none", outline: "none", fontSize: "15px", color: "#333", width: "100%", background: "transparent" }} />
          </div>
          <div style={{ width: "1px", height: "28px", backgroundColor: "#e5e7eb" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 8px" }}>
            <svg width="16" height="16" fill="none" stroke="#999" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2" />
            </svg>
            <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ border: "none", outline: "none", fontSize: "15px", color: "#333", background: "transparent", cursor: "pointer" }}>
              <option>Florence, Italy</option>
              <option>New York, USA</option>
              <option>London, UK</option>
              <option>Dhaka, Bangladesh</option>
            </select>
          </div>
          <button type="submit" style={{ background: "#5b4fe9", color: "white", border: "none", borderRadius: "8px", padding: "14px 24px", fontSize: "15px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Search my job
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ color: "#888", fontSize: "14px" }}>Popular :</span>
          {popularTags.map((tag, i) => (
            <button key={tag} onClick={() => { setJobQuery(tag); router.push(`/jobs?query=${tag}`); }} style={{ background: "transparent", border: "none", color: "#555", fontSize: "14px", cursor: "pointer", padding: "0", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {tag}{i < popularTags.length - 1 ? "," : ""}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", minHeight: "420px" }}>
        <svg width="360" height="360" style={{ position: "absolute", opacity: 0.3 }} viewBox="0 0 360 360">
          <rect x="80" y="40" width="200" height="280" rx="4" fill="none" stroke="#a5b4fc" strokeWidth="1.5" />
          <rect x="60" y="60" width="200" height="280" rx="4" fill="none" stroke="#c7d2fe" strokeWidth="1" />
        </svg>
        <div style={{ width: "320px", height: "380px", background: "linear-gradient(160deg, #ddd6fe 0%, #c7d2fe 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", color: "#7c3aed" }}>
            <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5" />
              <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
            </svg>
            <p style={{ opacity: 0.6, fontSize: "14px", marginTop: "8px" }}>Add person image here</p>
          </div>
        </div>
      </div>
    </section>
  );
}
