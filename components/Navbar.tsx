"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 60px", backgroundColor: "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => router.push("/")}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: "14px", fontWeight: 700 }}>Q</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "18px", color: "#1a1a2e" }}>QuickHire</span>
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <span style={{ color: "#444", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}>Find Jobs</span>
        <span style={{ color: "#444", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}>Browse Companies</span>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {status === "loading" ? (
          <div style={{ width: "80px", height: "36px", background: "#e5e7eb", borderRadius: "8px" }} />
        ) : session ? (
          <>
            <span onClick={() => router.push("/dashboard")} style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", cursor: "pointer" }}>
              {session.user.name?.split(" ")[0]}
            </span>
            <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ background: "transparent", border: "1.5px solid #e5e7eb", color: "#555", borderRadius: "8px", padding: "8px 18px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => router.push("/login")} style={{ background: "transparent", border: "none", color: "#444", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}>
              Login
            </button>
            <button onClick={() => router.push("/register")} style={{ background: "#5b4fe9", color: "white", border: "none", borderRadius: "8px", padding: "10px 22px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
