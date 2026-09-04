"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserInfo {
  is_staff: boolean;
}

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff]       = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access");
    if (!token) return;

    setIsLoggedIn(true);

    // is_staff ni API dan olish (background — UI ni bloklamaydi)
    fetch("http://127.0.0.1:8000/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: UserInfo | null) => {
        if (data?.is_staff) setIsStaff(true);
      })
      .catch(() => {}); // xato bo'lsa jim o'tamiz
  }, []);

  // Hydration mismatch oldini olish
  if (!mounted) {
    return <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />;
  }

  // ── Kirmagan holat ────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        id="nav-login-btn"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="h-3.5 w-3.5 shrink-0">
          <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-1.08a.75.75 0 1 1 1.004-1.116l2.5 2.25a.75.75 0 0 1 0 1.116l-2.5 2.25a.75.75 0 1 1-1.004-1.116l1.048-1.08H1.75A.75.75 0 0 1 1 10Z" clipRule="evenodd" />
        </svg>
        Kirish
      </Link>
    );
  }

  // ── Kirgan holat ─────────────────────────────────────────────────────────

  return (
    <div className="flex items-center gap-2">

      {/* Admin Panel linki — faqat is_staff bo'lsa ko'rinadi */}
      {isStaff && (
        <Link
          href="/admin"
          id="nav-admin-btn"
          className="hidden items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50 sm:inline-flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="h-3 w-3 shrink-0">
            <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 0 0 4.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 0 1-.493.11 3.01 3.01 0 0 1-1.618-1.616.455.455 0 0 1 .11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 0 0-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 1 0 3.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01ZM5 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd" />
          </svg>
          Admin
        </Link>
      )}

      {/* Profil ikonkasi */}
      <Link
        href="/profile"
        id="nav-profile-btn"
        aria-label="Profilim"
        className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
          <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
        </svg>
        {/* Online nuqtasi */}
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
      </Link>
    </div>
  );
}
