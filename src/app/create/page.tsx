"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateStartupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    project_type: "b2b",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/startups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          project_type: formData.project_type,
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.detail || "E'lonni qo'shishda xatolik yuz berdi. Iltimos, ma'lumotlarni tekshiring.");
      }
    } catch (err) {
      setError("Tarmoq xatosi yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900/50 dark:shadow-none dark:ring-1 dark:ring-zinc-800">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Yangi E&apos;lon Qo&apos;shish
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Loyiha yoki tayyor biznesingizni sotish uchun ma&apos;lumotlarni kiriting
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Sarlavha */}
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Loyiha nomi <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Masalan: Telegram bot yasash xizmati"
              className="block w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500"
            />
          </div>

          {/* Tavsif */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              To&apos;liq tavsifi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Loyihangiz haqida batafsil ma'lumot bering..."
              className="block w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500"
            />
          </div>

          {/* Narx */}
          <div>
            <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Narxi (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-zinc-500 dark:text-zinc-400">$</span>
              </div>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="block w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-8 pr-4 text-zinc-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Kategoriya */}
          <div>
            <label htmlFor="project_type" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Kategoriyasi <span className="text-red-500">*</span>
            </label>
            <select
              id="project_type"
              name="project_type"
              required
              value={formData.project_type}
              onChange={handleChange}
              className="block w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500"
            >
              <option value="b2b">B2B Platforma</option>
              <option value="b2c">B2C Xizmat</option>
              <option value="saas">SaaS (Dasturiy Ta'minot)</option>
              <option value="marketplace">Marketplace (Bozor)</option>
              <option value="other">Boshqa</option>
            </select>
          </div>

          {/* Tugmalar */}
          <div className="pt-2 flex items-center gap-4">
            <Link
              href="/"
              className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Qo&apos;shilmoqda...</span>
                </div>
              ) : (
                "E'lonni joylash"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
