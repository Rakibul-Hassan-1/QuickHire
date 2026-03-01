"use client";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
      Logout
    </button>
  );
}
