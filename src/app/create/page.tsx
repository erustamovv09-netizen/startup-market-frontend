"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateStartupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    price: "",
    project_type: "B2B",
    demo_url: "",
    github_url: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Foydalanuvchi yoza boshlaganda o'sha maydondagi xatoni tozalash
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
    }
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError("");

    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    // Payload tayyorlash
    const payload: Record<string, any> = {
      title: formData.title,
      description: formData.description,
      tech_stack: formData.tech_stack,
      price: Number(formData.price),
      project_type: formData.project_type,
    };
    if (formData.demo_url) payload.demo_url = formData.demo_url;
    if (formData.github_url) payload.github_url = formData.github_url;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/startups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        // Agar backenddan dict obyekt kelsa (Django validatsiyasi)
        if (typeof data === "object" && data !== null && !data.detail) {
          setFieldErrors(data);
        } else if (data.detail) {
          setGeneralError(data.detail);
        } else {
          setGeneralError("Noma'lum xatolik yuz berdi.");
        }
      }
    } catch (err) {
      setGeneralError("Tarmoq xatosi yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="w-full max-w-3xl space-y-8 rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900/50 dark:shadow-none dark:ring-1 dark:ring-zinc-800">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Yangi E&apos;lon Qo&apos;shish
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Loyiha yoki tayyor biznesingizni sotish uchun ma&apos;lumotlarni kiriting
          </p>
        </div>

        {generalError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ════ TO'LIQ ENLIKDAGI MAYDONLAR ════ */}
          <div className="space-y-6">
            
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
                className={`block w-full rounded-xl border ${fieldErrors.title && fieldErrors.title.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
              />
              {fieldErrors.title && fieldErrors.title.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Texnologiyalar to'plami */}
            <div>
              <label htmlFor="tech_stack" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Texnologiyalar to&apos;plami <span className="text-red-500">*</span>
              </label>
              <input
                id="tech_stack"
                name="tech_stack"
                type="text"
                required
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="Masalan: React, Django, PostgreSQL"
                className={`block w-full rounded-xl border ${fieldErrors.tech_stack && fieldErrors.tech_stack.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
              />
              {fieldErrors.tech_stack && fieldErrors.tech_stack.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.tech_stack[0]}</p>
              )}
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
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Loyihangiz haqida batafsil ma'lumot bering..."
                className={`block w-full resize-y rounded-xl border ${fieldErrors.description && fieldErrors.description.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
              />
              {fieldErrors.description && fieldErrors.description.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.description[0]}</p>
              )}
            </div>
          </div>

          {/* ════ 2-KOLONNALI GRID ════ */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
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
                  className={`block w-full rounded-xl border ${fieldErrors.price && fieldErrors.price.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white py-2.5 pl-8 pr-4 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
                />
              </div>
              {fieldErrors.price && fieldErrors.price.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.price[0]}</p>
              )}
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
                className={`block w-full appearance-none rounded-xl border ${fieldErrors.project_type && fieldErrors.project_type.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
              >
                <option value="B2B">B2B Platforma</option>
                <option value="B2C">B2C Xizmat</option>
                <option value="SAAS">SaaS (Dasturiy Ta'minot)</option>
                <option value="MARKETPLACE">Marketplace (Bozor)</option>
                <option value="OTHER">Boshqa</option>
              </select>
              {fieldErrors.project_type && fieldErrors.project_type.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.project_type[0]}</p>
              )}
            </div>

            {/* Demo URL */}
            <div>
              <label htmlFor="demo_url" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Jonli demo havolasi <span className="text-xs text-zinc-400">(Ixtiyoriy)</span>
              </label>
              <input
                id="demo_url"
                name="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={handleChange}
                placeholder="https://example.com"
                className={`block w-full rounded-xl border ${fieldErrors.demo_url && fieldErrors.demo_url.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
              />
              {fieldErrors.demo_url && fieldErrors.demo_url.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.demo_url[0]}</p>
              )}
            </div>

            {/* GitHub URL */}
            <div>
              <label htmlFor="github_url" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                GitHub havolasi <span className="text-xs text-zinc-400">(Ixtiyoriy)</span>
              </label>
              <input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={`block w-full rounded-xl border ${fieldErrors.github_url && fieldErrors.github_url.length > 0 ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300 focus:border-indigo-600 focus:ring-indigo-600/20"} bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:focus:border-indigo-500`}
              />
              {fieldErrors.github_url && fieldErrors.github_url.length > 0 && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.github_url[0]}</p>
              )}
            </div>
          </div>

          {/* Tugmalar */}
          <div className="pt-6 flex flex-col-reverse sm:flex-row items-center gap-4 sm:justify-end">
            <Link
              href="/"
              className="w-full sm:w-auto rounded-xl px-6 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:opacity-50"
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
