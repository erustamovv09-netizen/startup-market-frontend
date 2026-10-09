"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

// ─── Asosiy login forma ───────────────────────────────────────────────────────

function LoginForm() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const justRegistered = searchParams.get("registered") === "true";
  const loginRequired = searchParams.get("error") === "login_required";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");

  // Google login sessiyasini sinxronlash
  useEffect(() => {
    if (status === "authenticated" && session) {
      const accessToken = (session as any).accessToken;
      
      // Agar NextAuth 'authenticated' bo'lsayu, lekin Django tokeni yo'q bo'lsa (Backend ulanmagan bo'lsa)
      // NextAuth'dan chiqaramiz, aks holda infinite loop (kirib-chiqish) bo'lib qoladi.
      if (!accessToken) {
        setDebugMsg("Google tokeni bor, lekin Backend tokeni yo'q. Tozalanmoqda...");
        signOut({ redirect: false });
        return;
      }

      localStorage.setItem("access", accessToken);
      document.cookie = `access=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      window.location.href = "/";
    }
  }, [status, session]);

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Foydalanuvchi nomi va parolni kiriting");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const apiUrl = `http://${window.location.hostname}:8000/api/token/`;
    setDebugMsg(`Ulanilmoqda: ${apiUrl}`);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      setDebugMsg(`Server javobi: ${res.status}`);

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        document.cookie = `access=${data.access}; path=/; max-age=86400; SameSite=Lax`;
        setDebugMsg("✅ Token saqlandi");
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Foydalanuvchi nomi yoki parol noto'g'ri");
        setDebugMsg(`❌ Xato: ${res.status}`);
      }
    } catch (err: any) {
      setError(`Serverga ulanib bo'lmadi: ${err.message}`);
      setDebugMsg(`❌ Fetch xatosi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── UI ───────────────────────────────────────────────────────────────────

  const inputCls =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 px-4 py-12 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-zinc-950">
      <div className="relative w-full max-w-md">

        {justRegistered && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800/60 dark:bg-emerald-950/40">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Ro&apos;yxatdan muvaffaqiyatli o&apos;tdingiz! Endi kiring.
            </p>
          </div>
        )}

        {loginRequired && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/60 dark:bg-amber-950/40">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              Platformadan to&apos;liq foydalanish uchun avval tizimga kiring.
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <div className="p-8">
            <div className="mb-8 text-center">
              <Link href="/" className="group mb-6 inline-flex items-center gap-2 text-lg font-bold tracking-tight">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white shadow-md transition-transform group-hover:scale-105">S</span>
                <span className="text-zinc-900 dark:text-white">StartUp <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Market</span></span>
              </Link>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Xush kelibsiz!</h1>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">Hisobingizga kiring</p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/60 dark:bg-red-950/40">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Debug panel — muammoni aniqlash uchun */}
            {debugMsg && (
              <div className="mb-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2">
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{debugMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); setDebugMsg(""); }}
                  placeholder="johndoe"
                  className={inputCls}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Parol</label>
                  <Link href="/forgot-password" className="text-xs text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400">
                    Parolni unutdingizmi?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Parolingizni kiriting"
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition hover:text-zinc-600"
                    aria-label={showPassword ? "Yashirish" : "Ko'rsatish"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                        <path d="M10.748 13.93l2.523 2.524a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Kirilmoqda...
                  </>
                ) : (
                  "Kirish"
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-400">yoki</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              id="login-google-btn"
              className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.73 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Google orqali kirish
            </button>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Hisobingiz yo&apos;qmi?{" "}
              <Link href="/register" id="go-to-register" className="font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400">
                Ro&apos;yxatdan o&apos;ting →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Suspense wrapper ──────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}