import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "App Idea Finder",
  description: "Find buildable app ideas with lightweight market signals, launch-ready ASO, and build prompts.",
  applicationName: "App Idea Finder",
  keywords: ["app ideas", "ASO", "indie developers", "market signals", "AI product ideas"],
  openGraph: {
    title: "App Idea Finder",
    description: "Find buildable app ideas with lightweight market signals, launch-ready ASO, and build prompts.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
