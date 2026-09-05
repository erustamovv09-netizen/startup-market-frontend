"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";

// ─── Turlar ───────────────────────────────────────────────────────────────────

interface FormData {
  firstName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  firstName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Sahifa ───────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors]   = useState<FieldErrors>({});
  const [serverError, setServerError]   = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Handlelar ──────────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Yozayotganda mos maydon xatosini tozalash
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError("");
  }

  // ─── Client validatsiya ──────────────────────────────────────────────────────

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Ismingiz talab qilinadi";
    }

    if (!formData.username.trim()) {
      errors.username = "Foydalanuvchi nomi talab qilinadi";
    } else if (formData.username.length < 3) {
      errors.username = "Kamida 3 ta belgi bo'lishi kerak";
    }

    if (!formData.email.trim()) {
      errors.email = "Email talab qilinadi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email formati noto'g'ri";
    }

    if (!formData.password) {
      errors.password = "Parol talab qilinadi";
    } else if (formData.password.length < 8) {
      errors.password = "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Parolni tasdiqlang";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Parollar mos kelmayapti";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ─── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload: Record<string, string> = {
        username: formData.username.trim(),
        password: formData.password,
      };
      if (formData.firstName.trim()) payload.first_name = formData.firstName.trim();
      if (formData.email.trim())     payload.email      = formData.email.trim();

      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        // Django field xatolarini bitta matnga birlashtirish
        const messages = Object.values(data)
          .flat()
          .join(" ");
        setServerError(messages || "Ro'yxatdan o'tishda xatolik yuz berdi");
      }
    } catch {
      setServerError("Serverga ulanib bo'lmadi. Keyinroq urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Parol kuchi ────────────────────────────────────────────────────────────

  function passwordStrength(): { level: number; label: string; color: string } {
    const p = formData.password;
    if (!p) return { level: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8)  score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: "Juda zaif", color: "bg-red-500" };
    if (score <= 2) return { level: 2, label: "Zaif",      color: "bg-orange-500" };
    if (score <= 3) return { level: 3, label: "O'rtacha",  color: "bg-yellow-500" };
    if (score <= 4) return { level: 4, label: "Yaxshi",    color: "bg-emerald-400" };
    return               { level: 5, label: "Kuchli",     color: "bg-emerald-500" };
  }

  const strength = passwordStrength();

  // ─── UI ─────────────────────────────────────────────────────────────────────

  const inputBase =
    "w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 dark:text-white dark:placeholder-zinc-500";
  const inputOk =
    "border-zinc-300 bg-white hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600";
  const inputErr =
    "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-950/20";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 px-4 py-12 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-zinc-950">

      {/* Orqa fon dekoratsiya */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 opacity-40 blur-3xl dark:from-indigo-950 dark:to-violet-950 dark:opacity-25" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-gradient-to-bl from-violet-100 to-pink-100 opacity-30 blur-2xl dark:from-violet-950 dark:to-pink-950 dark:opacity-15" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Karta */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-indigo-500/8 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">

          {/* Tepa gradient chiziq */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <div className="p-8">

            {/* Sarlavha */}
            <div className="mb-8 text-center">
              <Link href="/" className="group mb-6 inline-flex items-center gap-2 text-lg font-bold tracking-tight">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
                  S
                </span>
                <span className="text-zinc-900 dark:text-white">
                  StartUp{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Market
                  </span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Hisob yaratish
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                Bepul ro&apos;yxatdan o&apos;ting va bozorga kiring
              </p>
            </div>

            {/* Server xatosi */}
            {serverError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/60 dark:bg-red-950/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-400">{serverError}</p>
              </div>
            )}

            {/* Forma */}
            <form id="register-form" onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Ism */}
              <div>
                <label htmlFor="reg-firstname" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ismingiz <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-firstname"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  autoFocus
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Alibek"
                  className={`${inputBase} ${fieldErrors.firstName ? inputErr : inputOk}`}
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.firstName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="reg-username" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Foydalanuvchi nomi <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`${inputBase} ${fieldErrors.username ? inputErr : inputOk}`}
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`${inputBase} ${fieldErrors.email ? inputErr : inputOk}`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              {/* Parol */}
              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Parol <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Kamida 8 ta belgi"
                    className={`${inputBase} pr-11 ${fieldErrors.password ? inputErr : inputOk}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                    aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                        <path d="M10.748 13.93l2.523 2.524a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Parol kuchi indikatori */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.level ? strength.color : "bg-zinc-200 dark:bg-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`mt-1 text-xs font-medium ${
                      strength.level <= 2 ? "text-red-500" :
                      strength.level === 3 ? "text-yellow-600" : "text-emerald-600"
                    }`}>
                      {strength.label}
                    </p>
                  </div>
                )}

                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              {/* Parolni tasdiqlash */}
              <div>
                <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Parolni tasdiqlash <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Parolni qaytaring"
                  className={`${inputBase} ${fieldErrors.confirmPassword ? inputErr : inputOk}`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
                )}
                {/* Mos kelish belgisi */}
                {formData.confirmPassword && !fieldErrors.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="h-3 w-3 shrink-0">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    Parollar mos keldi
                  </p>
                )}
              </div>

              {/* Submit tugma */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 shrink-0 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Ro&apos;yxatdan o&apos;tilmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </button>
            </form>

            {/* Login havolasi */}
            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Hisobingiz bor mi?{" "}
              <Link
                href="/login"
                id="go-to-login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Kirish →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
