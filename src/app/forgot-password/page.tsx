"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/password_reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.email?.[0] || "Ushbu email tizimda topilmadi yoki xatolik yuz berdi.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Tarmoq xatosi yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center bg-zinc-50 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Parolni tiklash
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Elektron pochtangizni kiriting, biz sizga parolni tiklash havolasini yuboramiz.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-2xl sm:px-12 dark:bg-zinc-900/50 dark:ring-1 dark:ring-zinc-800">
          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Email yuborildi!</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <b>{email}</b> manziliga parolni tiklash havolasini yubordik. Iltimos, pochtangizni tekshiring. (Pochtangizga havola kelmasa, Spam jildini ham qarang yoki konsolni tekshiring)
              </p>
              <div className="mt-6">
                <Link href="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  ← Login sahifasiga qaytish
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {errorMsg}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
                  Email manzil
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                    className="block w-full rounded-xl border-0 py-2.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:focus:ring-indigo-500"
                    placeholder="Sizning emailingiz"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {status === "loading" ? "Yuborilmoqda..." : "Tiklash havolasini yuborish"}
              </button>

              <div className="text-center text-sm">
                <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  ← Orqaga
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
