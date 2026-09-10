"use client";
import { API_BASE_URL } from "@/lib/api";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

// ─── Turlar ───────────────────────────────────────────────────────────────────

interface FormData {
  username: string;
  password: string;
}

interface FieldErrors {
  username?: string;
  password?: string;
}

// ─── Asosiy login forma ───────────────────────────────────────────────────────

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const justRegistered = searchParams.get("registered") === "true";
  const loginRequired  = searchParams.get("error") === "login_required";

  const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
  const [fieldErrors, setFieldErrors]   = useState<FieldErrors>({});
  const [serverError, setServerError]   = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Handlelar ────────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError("");
  }

  // ─── Client validatsiya ───────────────────────────────────────────────────

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!formData.username.trim()) errors.username = "Foydalanuvchi nomini kiriting";
    if (!formData.password)        errors.password = "Parolni kiriting";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // JWT tokenlarni localStorage ga saqlash
        localStorage.setItem("access",  data.access);
        localStorage.setItem("refresh", data.refresh);
        // Middleware o'qiy olishi uchun cookie'ga ham saqlaymiz
        document.cookie = `access=${data.access}; path=/; max-age=86400; SameSite=Lax`;
        
        // Bosh sahifaga yo'naltirish
        router.push("/");
        router.refresh(); // server komponentlarni yangilash uchun
      } else {
        const data = await res.json();
        // Django SimpleJWT xato: { detail: "..." }
        setServerError(
          data.detail ||
          "Foydalanuvchi nomi yoki parol noto'g'ri"
        );
      }
    } catch {
      setServerError("Serverga ulanib bo'lmadi. Keyinroq urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

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
        <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 opacity-30 blur-2xl dark:from-indigo-950 dark:to-sky-950 dark:opacity-15" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Muvaffaqiyatli ro'yxatdan o'tish xabari */}
        {justRegistered && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800/60 dark:bg-emerald-950/40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0 text-emerald-600">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Ro&apos;yxatdan muvaffaqiyatli o&apos;tdingiz! Endi kiring.
            </p>
          </div>
        )}

        {/* Majburiy avtorizatsiya xabari (Middleware dan) */}
        {loginRequired && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/60 dark:bg-amber-950/40">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0 text-amber-600">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              Platformadan to&apos;liq foydalanish uchun avval ro&apos;yxatdan o&apos;ting yoki tizimga kiring.
            </p>
          </div>
        )}

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
                Xush kelibsiz!
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                Hisobingizga kiring
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
            <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Username */}
              <div>
                <label htmlFor="login-username" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Foydalanuvchi nomi
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`${inputBase} ${fieldErrors.username ? inputErr : inputOk}`}
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.username}</p>
                )}
              </div>

              {/* Parol */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Parol
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Parolni unutdingizmi?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Parolingizni kiriting"
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
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit tugma */}
              <button
                id="login-submit-btn"
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
                    Kirilmoqda...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="h-4 w-4 shrink-0">
                      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.08a.75.75 0 1 0-1.004-1.116l-2.5 2.25a.75.75 0 0 0 0 1.116l2.5 2.25a.75.75 0 1 0 1.004-1.116l-1.048-1.08H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                    </svg>
                    Kirish
                  </>
                )}
              </button>
            </form>

            {/* Ajratuvchi */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-400">yoki</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            </div>

            {/* Google orqali kirish */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              id="login-google-btn"
              className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.73 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Google orqali kirish
            </button>

            {/* Ro'yxatdan o'tish havolasi */}
            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Hisobingiz yo&apos;qmi?{" "}
              <Link
                href="/register"
                id="go-to-register"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Ro&apos;yxatdan o&apos;ting →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Suspense wrapper — useSearchParams uchun zarur ──────────────────────────

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
