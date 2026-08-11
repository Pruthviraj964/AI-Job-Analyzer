import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "AI Job Market Analyzer — Career Intelligence Platform",
  description: "AI-powered career intelligence platform. Skill gap analysis, ATS scoring, and personalized learning roadmaps grounded in real market data.",
  keywords: "AI job market, career intelligence, skill gap analyzer, ATS score, data science jobs",
  openGraph: {
    title: "AI Job Market Analyzer",
    description: "Turn job market uncertainty into a clear, AI-driven career action plan.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
