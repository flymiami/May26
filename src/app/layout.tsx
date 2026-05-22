import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "May26 — Business portal",
  description:
    "Centralized portal for the FY portfolio: ads, finance, operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
