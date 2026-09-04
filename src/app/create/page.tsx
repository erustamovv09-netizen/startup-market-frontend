"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Forma maydonlari turi ─────────────────────────────────────────────────────

interface FormData {
  title: string;
  description: string;
  price: string;
  tech_stack: string;
  project_type: string;
  demo_link: string;
  github_link: string;
}

// ─── project_type variantlari ─────────────────────────────────────────────────

const PROJECT_TYPES = [
  { value: "website",      label: "🌐  Veb-sayt" },
  { value: "bot",          label: "🤖  Telegram Bot" },
  { value: "mobile",       label: "📱  Mobil ilova" },
  { value: "saas",         label: "☁️   SaaS platforma" },
  { value: "ecommerce",    label: "🛒  E-Commerce" },
  { value: "dashboard",    label: "📊  Dashboard" },
  { value: "api",          label: "⚙️   API / Backend" },
  { value: "other",        label: "💡  Boshqa" },
];

// ─── Asosiy sahifa komponenti ─────────────────────────────────────────────────

export default function CreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    tech_stack: "",
    project_type: "website",
    demo_link: "",
    github_link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormData>>({});

  // ─── Validatsiya ─────────────────────────────────────────────────────────────

  function isValidUrl(url: string): boolean {
    try { new URL(url); return true; } catch { return false; }
  }

  function validate(): boolean {
    const errors: Partial<FormData> = {};
    if (!formData.title.trim())       errors.title = "Sarlavha kiritilishi shart";
    if (!formData.description.trim()) errors.description = "Tavsif kiritilishi shart";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      errors.price = "To'g'ri narx kiriting";
    if (!formData.tech_stack.trim())  errors.tech_stack = "Texnologiyalar kiritilishi shart";
    if (formData.demo_link.trim() && !isValidUrl(formData.demo_link.trim()))
      errors.demo_link = "To'g'ri URL kiriting (https://...)";
    if (formData.github_link.trim() && !isValidUrl(formData.github_link.trim()))
      errors.github_link = "To'g'ri GitHub URL kiriting (https://...)";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ─── Input o'zgarganda ────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Maydon to'g'rilanganida xatoni tozalash
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // ─── Forma yuborilganda ───────────────────────────────────────────────────────

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/startups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title:        formData.title.trim(),
          description:  formData.description.trim(),
          price:        formData.price,
          tech_stack:   formData.tech_stack.trim(),
          project_type: formData.project_type,
          // Bo'sh bo'lsa null yuboriladi (Django null=True qabul qiladi)
          demo_link:    formData.demo_link.trim() || null,
          github_link:  formData.github_link.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const firstError = Object.values(data)[0];
        throw new Error(
          Array.isArray(firstError) ? firstError[0] : "Server xatoligi yuz berdi."
        );
      }

      // Muvaffaqiyatli — bosh sahifaga qaytish va ma'lumotni yangilash
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noma'lum xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20">
      {/* Fon dekorativ elementlar */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200 to-violet-200 opacity-30 blur-3xl dark:from-indigo-900 dark:to-violet-900 dark:opacity-20" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-200 opacity-20 blur-2xl dark:from-sky-900 dark:to-indigo-900 dark:opacity-15" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Orqaga tugmasi */}
        <Link
          href="/"
          id="back-to-home"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Bosh sahifaga qaytish
        </Link>

        {/* Sarlavha */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 dark:border-indigo-800 dark:bg-indigo-950/50">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Yangi e&apos;lon
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Loyihangizni joylashtiring
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Barcha maydonlarni to&apos;ldiring. Xaridorlar siz bilan bog&apos;lanishadi.
          </p>
        </div>

        {/* Forma kartasi */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800/80 dark:bg-zinc-900">

          {/* Karta yuqori chiziq (gradient aksent) */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <form onSubmit={onSubmit} noValidate className="space-y-6 p-6 sm:p-8">

            {/* ── Server xatoligi ── */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
              >
                <span className="mt-0.5 text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Xatolik yuz berdi
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
                </div>
              </div>
            )}

            {/* ── Sarlavha ── */}
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Loyiha sarlavhasi
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Masalan: Telegram savdo boti yoki E-Commerce platforma"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 ${
                  fieldErrors.title
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20"
                    : "border-zinc-300 bg-white hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
              />
              {fieldErrors.title && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* ── Tavsif ── */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Loyiha tavsifi
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Loyihangiz nima ish qiladi? Qanday muammolarni hal qiladi? Funksiyalari haqida batafsil yozing..."
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 ${
                  fieldErrors.description
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20"
                    : "border-zinc-300 bg-white hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
              />
              {fieldErrors.description && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* ── Narx va Loyiha turi (2 ustun) ── */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Narx */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Narx (USD)
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400 dark:text-zinc-500">
                    $
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full rounded-xl border py-3 pl-8 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 ${
                      fieldErrors.price
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20"
                        : "border-zinc-300 bg-white hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}
                  />
                </div>
                {fieldErrors.price && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                    {fieldErrors.price}
                  </p>
                )}
              </div>

              {/* Loyiha turi */}
              <div>
                <label
                  htmlFor="project_type"
                  className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Loyiha turi
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="project_type"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition-all duration-150 hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:hover:border-zinc-600"
                  >
                    {PROJECT_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown strelkasi */}
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* ── Texnologiyalar ── */}
            <div>
              <label
                htmlFor="tech_stack"
                className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                Texnologiyalar (Tech Stack)
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="tech_stack"
                name="tech_stack"
                type="text"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="Django, React, PostgreSQL, Docker"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 ${
                  fieldErrors.tech_stack
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20"
                    : "border-zinc-300 bg-white hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
              />
              <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                Vergul ( , ) bilan ajrating
              </p>
              {fieldErrors.tech_stack && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.tech_stack}
                </p>
              )}
            </div>

            {/* ══ Ixtiyoriy havolalar bo'limi ══════════════════════════════ */}
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-700 dark:bg-zinc-800/30">

              {/* Bo'lim sarlavhasi */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-base">🔗</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Havolalar
                    <span className="ml-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                      ixtiyoriy
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Demo yoki manba kodini qo&apos;shsangiz, xaridorlar ko&apos;proq ishonadi
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* Demo havola */}
                <div>
                  <label
                    htmlFor="demo_link"
                    className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="14"
                      height="14"
                      className="h-3.5 w-3.5 shrink-0 text-sky-500"
                    >
                      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                    </svg>
                    Demo havola
                  </label>
                  <input
                    id="demo_link"
                    name="demo_link"
                    type="url"
                    value={formData.demo_link}
                    onChange={handleChange}
                    placeholder="https://demo.loyiha.uz"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 ${
                      fieldErrors.demo_link
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-zinc-600 dark:hover:border-zinc-500"
                    }`}
                  />
                  {fieldErrors.demo_link && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {fieldErrors.demo_link}
                    </p>
                  )}
                </div>

                {/* GitHub havola */}
                <div>
                  <label
                    htmlFor="github_link"
                    className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="14"
                      height="14"
                      className="h-3.5 w-3.5 shrink-0 text-zinc-500"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                    </svg>
                    GitHub havola
                  </label>
                  <input
                    id="github_link"
                    name="github_link"
                    type="url"
                    value={formData.github_link}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 ${
                      fieldErrors.github_link
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:hover:border-zinc-500"
                    }`}
                  />
                  {fieldErrors.github_link && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {fieldErrors.github_link}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Ajratuvchi chiziq ── */}
            <div className="border-t border-zinc-100 dark:border-zinc-800" />

            {/* ── Tugmalar ── */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/"
                id="cancel-btn"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Bekor qilish
              </Link>
              <button
                id="submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    {/* Loading spinner */}
                    <svg
                      className="h-4 w-4 shrink-0 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                      className="h-4 w-4 shrink-0"
                    >
                      <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.288Z" />
                    </svg>
                    E&apos;lonni joylashtirish
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Pastki eslatma */}
        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          E&apos;lon joylashtirib, siz platformamiz{" "}
          <span className="text-zinc-500 dark:text-zinc-500">foydalanish shartlari</span>
          {" "}bilan rozisiz.
        </p>
      </div>
    </div>
  );
}
