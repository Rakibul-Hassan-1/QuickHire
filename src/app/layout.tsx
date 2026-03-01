import type { Metadata } from "next";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickHire",
  description: "Find your dream job",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
