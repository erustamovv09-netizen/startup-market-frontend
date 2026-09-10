import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartUp Market — IT loyihalar bozori",
  description:
    "O'zbekistondagi eng yirik B2B IT loyihalar va startaplar bozori. Tayyor biznes xarid qiling yoki o'z loyihangizni soting.",
  keywords: "startup, IT loyiha, sotish, xarid, O'zbekiston, b2b marketplace",
  openGraph: {
    title: "StartUp Market — IT loyihalar bozori",
    description: "Tayyor biznes xarid qiling yoki o'z loyihangizni soting.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white dark:bg-zinc-950">
        <Navbar />
        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
