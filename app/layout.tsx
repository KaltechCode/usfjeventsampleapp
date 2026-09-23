import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tent of Hope | United Servants For Jesus",
  description: "Join Tent of Hope at Hill of Terror in Bonnieville, Kentucky. Prayer, free Bibles, and the hope we have in Jesus. Register your interest in attending.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kodchasan:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
