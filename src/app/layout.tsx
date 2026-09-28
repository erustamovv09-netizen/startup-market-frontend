import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { MessageProvider } from "./components/MessageContext";
import AuthProvider from "./components/AuthProvider"; // 1. AuthProvider ni import qilamiz
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
        {/* 2. Butun ilovani AuthProvider bilan o'rab chiqamiz */}
        <AuthProvider>
          <MessageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </MessageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}