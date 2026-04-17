import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PHG Talent Assessment",
  description: "Panna Hospitality Group — Candidate Assessment Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
