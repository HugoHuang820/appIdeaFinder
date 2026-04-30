import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-jp",
  weight: ["400", "500", "600", "700"],
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sc",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "App Idea Finder",
  description: "Find buildable app ideas with lightweight market signals, launch-ready ASO, and build prompts.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJp.variable} ${notoSansSc.variable}`}>{children}</body>
    </html>
  );
}
