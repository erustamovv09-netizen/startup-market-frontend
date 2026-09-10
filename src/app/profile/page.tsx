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
}

interface MyStartup {
  id: number;
  title: string;
  description: string;
  price: string;
  project_type_display: string;
  is_premium: boolean;
  is_sold: boolean;
  created_at: string;
}

// ─── Sahifa ───────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser]               = useState<UserProfile | null>(null);
  const [myStartups, setMyStartups]   = useState<MyStartup[]>([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState("");
  const [logoutModal, setLogoutModal] = useState(false);

  // ── Auth tekshirish + profil ma'lumotlarini olish ─────────────────────────

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const [profileRes, startupsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://127.0.0.1:8000/api/my-startups/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        if (profileRes.status === 401) {
          // Token eskirgan — login sahifasiga yo'naltirish
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          router.replace("/login");
          return;
        }

        if (!profileRes.ok) {
          setFetchError("Profil ma'lumotlarini yuklab bo'lmadi.");
          return;
        }

        const data: UserProfile = await profileRes.json();
        setUser(data);

        if (startupsRes.ok) {
          const startupsData: MyStartup[] = await startupsRes.json();
          setMyStartups(startupsData);
        }
      } catch {
        setFetchError("Serverga ulanib bo'lmadi.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  // ── Mening e'lonimni o'chirish ─────────────────────────────────────────────

  async function deleteMyStartup(id: number) {
    if (!confirm("Haqiqatan ham bu e'lonni o'chirmoqchimisiz?")) return;
    
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/my-startups/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMyStartups(myStartups.filter((s) => s.id !== id));
      } else {
        alert("O'chirishda xatolik yuz berdi.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ── Sotildi deb belgilash ───────────────────────────────────────────────────

  async function markAsSold(id: number) {
    if (!confirm("Ushbu e'lonni 'Sotildi' deb belgilamoqchimisiz?")) return;
    
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/startups/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_sold: true }),
      });

      if (res.ok) {
        setMyStartups(myStartups.map((s) => (s.id === id ? { ...s, is_sold: true } : s)));
        alert("E'lon muvaffaqiyatli 'Sotildi' deb belgilandi!");
      } else {
        alert("Xatolik yuz berdi.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ── Chiqish ────────────────────────────────────────────────────────────────

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/";
  }

  // ── Avatar harfi ──────────────────────────────────────────────────────────

  const avatarLetter = user?.username?.charAt(0).toUpperCase() ?? "?";

  // ── Loading holati ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Profil yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  // ── Xatolik holati ───────────────────────────────────────────────────────

  if (fetchError) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800/50 dark:bg-red-950/30">
          <div className="mb-3 text-4xl">⚠️</div>
          <h2 className="mb-2 text-lg font-bold text-red-800 dark:text-red-300">Xatolik</h2>
          <p className="mb-5 text-sm text-red-600 dark:text-red-400">{fetchError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  // ── Asosiy UI ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">

      {/* Orqa fon aksenti */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-indigo-950/20 dark:to-transparent"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Orqaga havolasi */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="14"
            height="14"
            className="h-3.5 w-3.5 shrink-0"
          >
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Bosh sahifa
        </Link>

        {/* ── Sahifa sarlavhasi ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Profilim
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Hisob ma&apos;lumotlari va sozlamalar
            </p>
          </div>

          <button
            id="profile-logout-top"
            type="button"
            onClick={() => setLogoutModal(true)}
            className="inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 active:scale-95 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 sm:self-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="14"
              height="14"
              className="h-3.5 w-3.5 shrink-0"
            >
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-1.08a.75.75 0 1 1 1.004-1.116l2.5 2.25a.75.75 0 0 1 0 1.116l-2.5 2.25a.75.75 0 1 1-1.004-1.116l1.048-1.08H6.75A.75.75 0 0 1 6 10Z" clipRule="evenodd" />
            </svg>
            Chiqish
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Chap ustun: Avatar + Asosiy info ── */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

              {/* Gradient banner */}
              <div className="h-20 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600" />

              <div className="-mt-10 px-5 pb-6">
                <div className="mb-4 flex items-end justify-between">
                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-black text-white shadow-lg dark:border-zinc-900">
                    {avatarLetter}
                  </div>
                  <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    Faol
                  </span>
                </div>

                {/* To'liq ism (katta, bold) + username (kichik, kulrang) */}
                <div className="mb-1">
                  <h2 className="text-xl font-bold leading-tight text-zinc-900 dark:text-white">
                    {user?.first_name?.trim() || user?.username}
                  </h2>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    @{user?.username}
                  </p>
                </div>
                {user?.email && (
                  <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                )}
                <p className="mb-5 text-xs text-zinc-400 dark:text-zinc-500">
                  StartUp Market a&apos;zosi
                </p>

                <Link
                  href="/create"
                  id="profile-create-btn"
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="14"
                    height="14"
                    className="h-3.5 w-3.5 shrink-0"
                  >
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Yangi e&apos;lon berish
                </Link>
              </div>
            </div>
          </div>

          {/* ── O'ng ustun: Ma'lumotlar + E'lonlar ── */}
          <div className="space-y-6 lg:col-span-2">

            {/* ── Mening ma'lumotlarim ── */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Mening ma&apos;lumotlarim
                </h3>
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  API dan olingan hisob ma&apos;lumotlari
                </p>
              </div>
              <div className="divide-y divide-zinc-100 px-6 dark:divide-zinc-800">
                {[
                  {
                    label: "Foydalanuvchi nomi",
                    value: user?.username || "—",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15" className="h-[15px] w-[15px] shrink-0 text-zinc-400">
                        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Email",
                    value: user?.email || "—",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15" className="h-[15px] w-[15px] shrink-0 text-zinc-400">
                        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                      </svg>
                    ),
                  },

                  {
                    label: "Foydalanuvchi ID",
                    value: user?.id ? `#${user.id}` : "—",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15" className="h-[15px] w-[15px] shrink-0 text-zinc-400">
                        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-2.5">
                      {row.icon}
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {row.label}
                      </span>
                    </div>
                    <span className="max-w-[200px] truncate text-right text-sm font-medium text-zinc-900 dark:text-white">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mening e'lonlarim ── */}
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Mening e&apos;lonlarim
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                    Siz joylashtirilgan startaplar ({myStartups.length})
                  </p>
                </div>
                <Link
                  href="/create"
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  + Yangi
                </Link>
              </div>
              
              {myStartups.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="mb-3 text-4xl">📭</div>
                  <h4 className="mb-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Sizda hozircha e&apos;lonlar yo&apos;q
                  </h4>
                  <p className="mb-5 text-xs text-zinc-400 dark:text-zinc-500">
                    Birinchi loyihangizni joylashtiring va xaridorlarni jalb qiling
                  </p>
                  <Link
                    href="/create"
                    id="profile-empty-create-btn"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    E&apos;lon berish →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                {myStartups.map((s) => (
                    <article
                      key={s.id}
                      className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50"
                    >
                      {s.is_premium && (
                        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-yellow-400 to-yellow-600" />
                      )}
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {s.project_type_display}
                        </span>
                        {s.is_premium && (
                          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">
                            ⭐ Premium
                          </span>
                        )}
                      </div>
                      <h4 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">
                        {s.title}
                      </h4>
                      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {s.description}
                      </p>

                      <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-700/50">
                        <span className="font-bold text-lg text-zinc-900 dark:text-white">
                          ${s.price}
                        </span>
                        <div className="grid grid-cols-2 gap-2 xl:flex xl:flex-wrap">
                          <Link
                            href={`/startups/${s.id}`}
                            className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600/80"
                          >
                            Ko&apos;rish
                          </Link>
                          {!s.is_sold ? (
                            <button
                              onClick={() => markAsSold(s.id)}
                              className="inline-flex items-center justify-center rounded-md border border-green-300 bg-gradient-to-r from-green-400 to-emerald-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white transition hover:from-green-500 hover:to-emerald-700"
                            >
                              Sotildi
                            </button>
                          ) : (
                            <span className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-500 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                              Sotilgan 🔒
                            </span>
                          )}
                          <button
                            onClick={() => router.push(`/edit/${s.id}`)}
                            className="inline-flex items-center justify-center rounded-md border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-yellow-700 transition hover:bg-yellow-100 dark:border-yellow-700/50 dark:bg-yellow-950/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
                          >
                            ✏️ Tahrir
                          </button>
                          <button
                            onClick={() => deleteMyStartup(s.id)}
                            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/50"
                          >
                            O&apos;chirish
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* ── Xavfli zona ── */}
            <div className="rounded-2xl border border-red-200/70 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20">
              <div className="border-b border-red-200/70 px-6 py-4 dark:border-red-900/40">
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Xavfli zona
                </h3>
                <p className="mt-0.5 text-xs text-red-600/70 dark:text-red-400/70">
                  Bu amalni qaytarib bo&apos;lmaydi
                </p>
              </div>
              <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Hisobdan chiqish
                  </p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">
                    Sessiya tugatiladi, tokenlar o&apos;chiriladi
                  </p>
                </div>
                <button
                  id="profile-logout-btn"
                  type="button"
                  onClick={() => setLogoutModal(true)}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-5 text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-95 dark:border-red-700 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="14"
                    height="14"
                    className="h-3.5 w-3.5 shrink-0"
                  >
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-1.08a.75.75 0 1 1 1.004-1.116l2.5 2.25a.75.75 0 0 1 0 1.116l-2.5 2.25a.75.75 0 1 1-1.004-1.116l1.048-1.08H6.75A.75.75 0 0 1 6 10Z" clipRule="evenodd" />
                  </svg>
                  Hisobdan chiqish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Logout tasdiqlash modali ── */}
      {logoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setLogoutModal(false)}
        >
          <div
            className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="20"
                  height="20"
                  className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                >
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">
                Hisobdan chiqmoqchimisiz?
              </h3>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                Sessiya tugatiladi. Qaytib kirish uchun parolingizni kiritishingiz kerak bo&apos;ladi.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutModal(false)}
                  className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  Bekor qilish
                </button>
                <button
                  id="confirm-logout-btn"
                  type="button"
                  onClick={handleLogout}
                  className="h-10 flex-1 rounded-lg bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
                >
                  Ha, chiqish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
