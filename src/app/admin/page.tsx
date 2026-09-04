"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Turlar ───────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  telegram_username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
};

// ─── Navigatsiya elementlari ──────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    id: "users",
    label: "Foydalanuvchilar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
        <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
      </svg>
    ),
  },
  {
    id: "startups",
    label: "E'lonlar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "stats",
    label: "Statistika",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
        <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 9.5 6ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 3.5 10Z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Sozlamalar",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

// ─── Asosiy komponent ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser]           = useState<UserProfile | null>(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [startups, setStartups]   = useState<Record<string, unknown>[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Ma'lumot olish + ruxsat tekshirish ────────────────────────────────────

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { router.replace("/login"); return; }

    async function init() {
      try {
        // Profil
        const pRes = await fetch("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!pRes.ok) { router.replace("/login"); return; }
        const profile: UserProfile = await pRes.json();

        if (!profile.is_staff) { router.replace("/"); return; }
        setUser(profile);

        // Startaplar ro'yxati
        const sRes = await fetch("http://127.0.0.1:8000/api/startups/");
        if (sRes.ok) setStartups(await sRes.json());
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  // ── Ko'rsatkichlar ────────────────────────────────────────────────────────

  const STATS = [
    { label: "Jami e'lonlar",   value: startups.length, icon: "📋", color: "from-indigo-500 to-violet-600" },
    { label: "Faol foydalanuvchilar", value: "—",       icon: "👥", color: "from-emerald-500 to-teal-600"  },
    { label: "Bu oylik savdolar",     value: "—",       icon: "💰", color: "from-amber-500 to-orange-600"  },
    { label: "Platformaning foizi",   value: "—",       icon: "📈", color: "from-sky-500 to-blue-600"      },
  ];

  // ── Sidebar nav element ───────────────────────────────────────────────────

  const SidebarLink = ({ item }: { item: NavItem }) => (
    <button
      type="button"
      onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        activeTab === item.id
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className={`ml-auto rounded-full px-1.5 py-0.5 text-xs font-bold ${
          activeTab === item.id ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
        }`}>
          {item.badge}
        </span>
      )}
    </button>
  );

  // ── Sidebar tarkibi ───────────────────────────────────────────────────────

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2.5 px-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-black text-white shadow-md shadow-indigo-500/25">
          A
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white">Admin Panel</p>
          <p className="text-[10px] text-zinc-400">StartUp Market</p>
        </div>
      </div>

      {/* Navigatsiya */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.id} item={item} />
        ))}
      </nav>

      {/* Admin info */}
      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-black text-white">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-900 dark:text-white">
              {user?.username}
            </p>
            <p className="text-[10px] text-zinc-400">
              {user?.is_superuser ? "Superadmin" : "Staff"}
            </p>
          </div>
          <Link
            href="/"
            className="ml-auto shrink-0 rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700"
            title="Bosh sahifaga qaytish"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="h-3.5 w-3.5 shrink-0">
              <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Kontent bo'limlari ───────────────────────────────────────────────────

  const renderContent = () => {
    switch (activeTab) {

      // ── Foydalanuvchilar ──
      case "users":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Foydalanuvchilar</h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Barcha ro'yxatdan o'tgan foydalanuvchilar</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Hozircha faqat siz</span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                  API kengaytirilmoqda
                </span>
              </div>
              {/* Hozirgi admin user */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{user?.username}</p>
                    <p className="truncate text-xs text-zinc-400">{user?.email || "Email yo'q"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.is_superuser && (
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                        Superadmin
                      </span>
                    )}
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Faol
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ── E'lonlar ──
      case "startups":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">E&apos;lonlar</h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Platformadagi barcha startaplar</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {startups.length === 0 ? (
                <div className="py-16 text-center text-zinc-400">
                  <div className="mb-2 text-4xl">📭</div>
                  <p className="text-sm">Hozircha e&apos;lonlar yo&apos;q</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {/* Jadval sarlavhasi */}
                  <div className="grid grid-cols-12 gap-4 bg-zinc-50 px-5 py-3 dark:bg-zinc-800/50">
                    <div className="col-span-5 text-xs font-semibold uppercase tracking-wide text-zinc-400">Sarlavha</div>
                    <div className="col-span-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Tur</div>
                    <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Narx</div>
                    <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Amallar</div>
                  </div>
                  {startups.map((s) => (
                    <div key={String(s.id)} className="grid grid-cols-12 items-center gap-4 px-5 py-3.5">
                      <div className="col-span-5 min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                          {String(s.title)}
                        </p>
                        <p className="truncate text-xs text-zinc-400">{String(s.tech_stack || "")}</p>
                      </div>
                      <div className="col-span-3">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                          {String(s.project_type_display || s.project_type || "")}
                        </span>
                      </div>
                      <div className="col-span-2 text-sm font-semibold text-zinc-900 dark:text-white">
                        ${String(s.price || "0")}
                      </div>
                      <div className="col-span-2">
                        <Link
                          href={`/startups/${s.id}`}
                          className="inline-flex h-7 items-center gap-1 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400"
                        >
                          Ko&apos;rish
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      // ── Statistika ──
      case "stats":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Statistika</h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Platform ko&apos;rsatkichlari</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {STATS.map((stat) => (
                <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10`} />
                  <div className="mb-3 text-2xl">{stat.icon}</div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // ── Sozlamalar ──
      case "settings":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Sozlamalar</h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Admin panel sozlamalari</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{user?.username}</p>
                  <p className="text-xs text-zinc-400">{user?.email || "Email yo'q"}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { k: "Rol",        v: user?.is_superuser ? "Superadmin" : "Staff" },
                  { k: "is_staff",   v: String(user?.is_staff)      },
                  { k: "is_superuser", v: String(user?.is_superuser) },
                  { k: "User ID",    v: `#${user?.id}`               },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between border-b border-zinc-100 py-2.5 last:border-0 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400">{row.k}</span>
                    <span className="font-medium text-zinc-900 dark:text-white">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Asosiy layout ────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">

      {/* ── Mobil sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-200 bg-white p-5 transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-900 lg:static lg:translate-x-0 lg:pt-8 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`} style={{ top: "4rem" }}>
        <SidebarContent />
      </aside>

      {/* ── Asosiy kontent ── */}
      <main className="flex-1 overflow-auto">

        {/* Mobil topbar */}
        <div className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Menyuni ochish"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="20" height="20" className="h-5 w-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">Admin Panel</span>
        </div>

        <div className="p-6 lg:p-8">

          {/* ── Statistika kartalar (dashboard tepasida) ── */}
          {activeTab !== "stats" && (
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${stat.color} opacity-10`} />
                  <div className="mb-1 text-xl">{stat.icon}</div>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Asosiy kontent ── */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
