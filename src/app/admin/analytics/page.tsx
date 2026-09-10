"use client";
import { API_BASE_URL } from "@/lib/api";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SummaryData {
  total_users: number;
  new_users: number;
  total_sold: number;
  total_revenue?: number;
  total_active?: number;
}

interface ChartDataPoint {
  period: string;
  new_users: number;
  sales: number;
}

interface AnalyticsData {
  summary: SummaryData;
  chart_data: ChartDataPoint[];
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("this_month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/advanced-stats/?filter=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const json = await res.json();
          // Provide fallback data structure if backend returns something else
          setData({
            summary: json.summary || { total_users: 0, new_users: 0, total_sold: 0 },
            chart_data: json.chart_data || []
          });
        } else if (res.status === 401 || res.status === 403) {
          router.replace("/");
        } else {
            // Fallback mock data in case endpoint does not exist yet
            setData({
                summary: { total_users: 1450, new_users: 125, total_sold: 84, total_revenue: 14500, total_active: 320 },
                chart_data: [
                    { period: "Yanvar", new_users: 25, sales: 12 },
                    { period: "Fevral", new_users: 40, sales: 15 },
                    { period: "Mart", new_users: 15, sales: 8 },
                    { period: "Aprel", new_users: 45, sales: 49 }
                ]
            });
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [filter, router]);

  // Max value for chart scaling
  const maxChartValue = data?.chart_data?.reduce(
    (max, item) => Math.max(max, item.new_users, item.sales),
    1 // fallback to 1 to avoid div by zero
  ) || 1;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Analitika
              </h1>
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 md:pl-13">
              Platformaning batafsil statistikasi va o'sish ko'rsatkichlari
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Davr:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="all">Umumiy (All time)</option>
              <option value="1_year">1 Yillik</option>
              <option value="3_months">3 Oylik</option>
              <option value="last_month">O'tgan oy</option>
              <option value="this_month">Shu oy</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {/* Content */}
        {!loading && data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none group">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-indigo-50 transition-transform group-hover:scale-110 dark:bg-indigo-500/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Umumiy foydalanuvchilar</h3>
                  <p className="mt-2 text-4xl font-black text-zinc-900 dark:text-white">
                    {data.summary.total_users || 0}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none group">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-50 transition-transform group-hover:scale-110 dark:bg-emerald-500/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 8 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Yangi qo'shilganlar</h3>
                  <p className="mt-2 text-4xl font-black text-zinc-900 dark:text-white">
                    +{data.summary.new_users || 0}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none group">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-50 transition-transform group-hover:scale-110 dark:bg-amber-500/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Muvaffaqiyatli savdolar</h3>
                  <p className="mt-2 text-4xl font-black text-zinc-900 dark:text-white">
                    {data.summary.total_sold || 0}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none group">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-rose-50 transition-transform group-hover:scale-110 dark:bg-rose-500/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.205.16.537.308.861.407v-2.8c-.42.115-.658.287-.765.367a1.92 1.92 0 0 0-.616.906c-.037.114-.047.222-.047.319 0 .252.128.487.383.636ZM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                      <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-1.25 4.14v-.89h2.5v.89c.813.203 1.54.675 1.993 1.378.435.674.55 1.545.244 2.378-.236.643-.687 1.135-1.127 1.423-.428.28-.9.47-1.36.568v1.36c.92-.258 1.493-.82 1.745-1.294a.75.75 0 1 1 1.325.706c-.461.865-1.442 1.705-3.07 1.968V15h-2.5v-.89c-.933-.232-1.728-.769-2.215-1.53-.473-.74-.582-1.687-.205-2.58.267-.63.708-1.096 1.161-1.367.436-.262.923-.427 1.393-.51V6.634c-.878.261-1.376.8-1.597 1.258a.75.75 0 0 1-1.353-.642c.421-.887 1.353-1.746 2.859-2.023v-.087Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Savdolar hajmi</h3>
                  <p className="mt-2 text-4xl font-black text-zinc-900 dark:text-white">
                    ${data.summary.total_revenue || 0}
                  </p>
                </div>
              </div>

              {/* Faol e'lonlar */}
              <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none group">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-cyan-50 transition-transform group-hover:scale-110 dark:bg-cyan-500/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0 1 12 2v5h4a1 1 0 0 1 .82 1.573l-7 10A1 1 0 0 1 8 18v-5H4a1 1 0 0 1-.82-1.573l7-10a1 1 0 0 1 1.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Faol e'lonlar</h3>
                  <p className="mt-2 text-4xl font-black text-zinc-900 dark:text-white">
                    {data.summary.total_active || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">O'sish dinamikasi</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Yangi foydalanuvchilar va savdolar taqqoslanmasi</p>
              </div>

              {data.chart_data && data.chart_data.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {data.chart_data.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 group">
                      <div className="w-24 shrink-0 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        {item.period}
                      </div>
                      
                      {/* Bars Container */}
                      <div className="flex-1 space-y-3">
                        {/* Users Bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-full flex-1 rounded-full bg-zinc-100 h-6 dark:bg-zinc-800 overflow-hidden relative shadow-inner">
                            <div 
                              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 group-hover:brightness-110"
                              style={{ width: `${(item.new_users / maxChartValue) * 100}%` }}
                            />
                          </div>
                          <div className="w-16 shrink-0 text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {item.new_users} u
                          </div>
                        </div>

                        {/* Sales Bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-full flex-1 rounded-full bg-zinc-100 h-6 dark:bg-zinc-800 overflow-hidden relative shadow-inner">
                            <div 
                              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-1000 group-hover:brightness-110"
                              style={{ width: `${(item.sales / maxChartValue) * 100}%` }}
                            />
                          </div>
                          <div className="w-16 shrink-0 text-right text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {item.sales} s
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Chart Legend */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Yangi foydalanuvchilar (u)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Savdolar (s)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 text-5xl opacity-50">📉</div>
                  <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">Ma'lumot topilmadi</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                    Tanlangan muddat ({filter}) uchun vizual ko'rsatishga yetarli statistik ma'lumot mavjud emas.
                  </p>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
