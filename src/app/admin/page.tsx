"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Turlar ───────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  email: string;
  phone_number: string;
  telegram_username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AdminUser {
  id: number;
  username: string;
  first_name: string;
  email: string;
  date_joined?: string;
  is_staff: boolean;
  is_active: boolean;
}

interface Startup {
  id: number;
  title: string;
  price: string;
  project_type_display: string;
  owner_info: {
    username: string;
  };
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
];

// ─── Asosiy komponent ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser]           = useState<UserProfile | null>(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [startups, setStartups]   = useState<Startup[]>([]);
  
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

        // Fetch users (admin only endpoint)
        const usersRes = await fetch("http://127.0.0.1:8000/api/admin/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersRes.ok) {
          setUsers(await usersRes.json());
        }

        // Fetch startups
        const startupsRes = await fetch("http://127.0.0.1:8000/api/startups/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (startupsRes.ok) {
          setStartups(await startupsRes.json());
        }
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // ── User holatini o'zgartirish (Ban/Unban) ────────────────────────────────
  async function toggleUserStatus(userId: number, currentStatus: boolean) {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}/toggle-status/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u)));
      }
    } catch (error) {
      console.error("Foydalanuvchi holatini o'zgartirishda xatolik:", error);
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500">Admin paneli yuklanmoqda...</p>
        </div>
      </div>
    );
  }

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
        <SidebarLink item={{ ...NAV_ITEMS[0], badge: users.length }} />
        <SidebarLink item={{ ...NAV_ITEMS[1], badge: startups.length }} />
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
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Foydalanuvchilar</h2>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Barcha ro&apos;yxatdan o&apos;tgan foydalanuvchilar ({users.length})</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">ID</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Ism</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Foydalanuvchi nomi</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Ro&apos;yxatdan o&apos;tgan</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Holati</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">Foydalanuvchilar topilmadi</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">#{u.id}</td>
                        <td className="px-6 py-4">{u.first_name || "Kiritilmagan"}</td>
                        <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">@{u.username}</td>
                        <td className="px-6 py-4">{u.email || "—"}</td>
                        <td className="px-6 py-4">
                          {u.date_joined ? new Date(u.date_joined).toLocaleDateString('uz-UZ') : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Holat nishonchasi */}
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                u.is_active
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              }`}
                            >
                              {u.is_active ? "Faol" : "Bloklangan"}
                            </span>
                            
                            {/* Harakat tugmasi */}
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(u.id, u.is_active)}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                                u.is_active
                                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:hover:bg-red-900/50"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50"
                              }`}
                            >
                              {u.is_active ? "Bloklash" : "Bandan ochish"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      // ── E'lonlar ──
      case "startups":
        return (
          <div>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">E&apos;lonlar</h2>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">Platformadagi barcha startaplar ({startups.length})</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">ID</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Nomi</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Turi</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Egasi</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Narxi</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {startups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">E'lonlar topilmadi</td>
                    </tr>
                  ) : (
                    startups.map((s) => (
                      <tr key={s.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">#{s.id}</td>
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{s.title}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                            {s.project_type_display || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                          @{s.owner_info?.username || "Noma'lum"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">${s.price}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/startups/${s.id}`}
                            className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Ko&apos;rish
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
