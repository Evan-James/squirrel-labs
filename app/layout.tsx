import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squirrel Labs — Less busywork. More business.",
  description: "AI agents, automation, websites and connected systems for Australian businesses. Follow the lead that almost got away.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className="antialiased">{children}</body>
    </html>
  );
}
