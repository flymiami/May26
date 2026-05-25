import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./site.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-site-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-site-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FLY Miami Art — Original works by Facundo Yebne",
  description:
    "Original paintings and mixed-media works by Facundo Yebne. Studio in Miami.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${serif.variable} ${sans.variable} site-root min-h-screen bg-black text-white antialiased`}
    >
      {children}
    </div>
  );
}
