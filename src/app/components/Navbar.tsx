"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMessages } from "./MessageContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { unreadCount } = useMessages();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    document.cookie = "access=; path=/; max-age=0; SameSite=Lax";
    setIsLoggedIn(false);
    closeMenu();
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2 text-lg font-bold tracking-tight"
            id="navbar-logo"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-black text-white shadow-lg shadow-indigo-500/30 transition-transform duration-200 group-hover:scale-105">
              S
            </span>
            <span className="text-zinc-900 dark:text-white">
              StartUp{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Market
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {([
              { href: "/", label: "Bosh sahifa" },
              { href: "/startups", label: "Barcha e\u2019lonlar", id: "nav-all-projects" },
              { href: "/create", label: "E\u2019lon berish", id: "nav-post-ad" },
            ] as { href: string; label: string; id?: string }[]).map(({ href, label, id }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  id={id}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-indigo-400"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Desktop auth */}
            {mounted && (
              <div className="hidden md:flex items-center gap-2">
                {isLoggedIn ? (
                  <>
                    <Link href="/profile" id="nav-profile-btn" aria-label="Profilim"
                      className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                      </svg>
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
                    </Link>
                    <button onClick={handleLogout}
                      className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      Chiqish
                    </button>
                  </>
                ) : (
                  <Link href="/login" id="nav-login-btn"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:opacity-90 active:scale-95"
                  >
                    Kirish
                  </Link>
                )}
              </div>
            )}

            {/* Hamburger button — mobile only */}
            <button
              id="mobile-menu-btn"
              type="button"
              aria-label={isMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:bg-zinc-100 md:hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
              {/* Notification badge */}
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-800" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Drawer ──────────────────────────────────────────────────── */}
      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel — slides in from top, below the navbar */}
      <div
        className={`fixed inset-x-0 top-14 z-50 md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-0 border-b border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="flex flex-col gap-1 p-4">

            <Link href="/" onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-zinc-400">
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
              </svg>
              Bosh sahifa
            </Link>

            <Link href="/startups" onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-zinc-400">
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.33.615Z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm2.25-14.084c0-.31-.19-.593-.48-.698a6.53 6.53 0 0 0-.77-.188V2.5a.75.75 0 0 0-1.5 0v.53a6.507 6.507 0 0 0-.77.188c-.29.105-.48.388-.48.698v6.647a.75.75 0 0 0 .75.75h2.5a.75.75 0 0 0 .75-.75V3.916Z" clipRule="evenodd" />
              </svg>
              Barcha e&apos;lonlar
            </Link>

            <Link href="/create" onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-base font-medium text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              E&apos;lon berish
            </Link>

            <Link href="/inbox" onClick={closeMenu}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-zinc-400">
                  <path fillRule="evenodd" d="M2 5.5A1.5 1.5 0 0 1 3.5 4h13A1.5 1.5 0 0 1 18 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5v-9ZM3.879 5.51a.75.75 0 0 0-1.061 1.061l6.652 6.652a.75.75 0 0 0 1.06 0l6.652-6.652a.75.75 0 1 0-1.061-1.061L10 11.603 3.879 5.51Z" clipRule="evenodd" />
                </svg>
                Xabarlar
              </div>
              {unreadCount > 0 && (
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500" />
              )}
            </Link>

            <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />

            {/* Mobile auth */}
            {mounted && (
              isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-zinc-400">
                      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                    </svg>
                    Profilim
                  </Link>
                  <button onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-base font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.08a.75.75 0 1 0-1.004-1.116l-2.5 2.25a.75.75 0 0 0 0 1.116l2.5 2.25a.75.75 0 1 0 1.004-1.116l-1.048-1.08h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                    </svg>
                    Chiqish
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                >
                  Kirish
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
