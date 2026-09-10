"use client";
import { API_BASE_URL } from "@/lib/api";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MarketplaceClient, { type Startup } from "../components/marketplace-client";

export default function StartupsPage() {
  const router = useRouter();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [startups, setStartups]             = useState<Startup[]>([]);
  const [isLoading, setIsLoading]           = useState(true);

  useEffect(() => {
    // 1. Auth tekshirish
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsAuthChecking(false);

    // 2. Startaplarni yuklash
    async function fetchStartups() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/startups/`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setStartups(data);
        } else {
          setStartups([]);
        }
      } catch {
        setStartups([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStartups();
  }, [router]);

  if (isAuthChecking || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isAuthChecking ? "Sessiya tekshirilmoqda..." : "E'lonlar yuklanmoqda..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
      
      {/* ══════════════════ HEADER ══════════════════ */}
      <section className="bg-white px-4 py-12 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Barcha loyihalar va startaplar
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
            Platformadagi barcha faol IT bizneslar, startaplar va raqamli loyihalar bilan tanishing. O'zingizga mos biznesni toping yoki sotib oling.
          </p>
        </div>
      </section>

      {/* ══════════════════ MARKETPLACE ══════════════════ */}
      <section className="flex-1 bg-zinc-50 py-8 dark:bg-zinc-950">
        <MarketplaceClient startups={startups} />
      </section>

    </div>
  );
}
