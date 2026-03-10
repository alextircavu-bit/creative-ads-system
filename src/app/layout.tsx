import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative System",
  description: "AI-powered ad creative workbench",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
