import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Footer from "./components/Footer";
import AuthButtons from "./components/AuthButtons";
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

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-xl font-bold tracking-tight"
          id="navbar-logo"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition-transform duration-200 group-hover:scale-105">
            S
          </span>
          <span className="text-zinc-900 dark:text-white">
            StartUp{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Market
            </span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/projects"
            id="nav-all-projects"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white"
          >
            Barcha loyihalar
          </Link>
          <Link
            href="/create"
            id="nav-post-ad"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-white"
          >
            E&apos;lon berish
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            type="button"
            aria-label="Menyu"
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Kirish / Chiqish — Client Component */}
          <AuthButtons />
        </div>
      </nav>
    </header>
  );
}

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
