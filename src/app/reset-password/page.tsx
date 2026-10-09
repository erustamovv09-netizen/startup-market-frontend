"use client";

import { useState, Suspense } from "react";
import { API_BASE_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!token) {
    return (
      <div className="text-center text-red-600 p-4">
        Yaroqsiz havola! Token topilmadi. Iltimos pochta xabaridagi havolani to'liq nusxalab oling.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMsg("Parollar mos kelmadi!");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setErrorMsg("Parol kamida 8 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/password_reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.password?.[0] || data.token?.[0] || data.detail || "Xatolik yuz berdi. Balki token eskirgan bo'lishi mumkin.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Tarmoq xatosi yuz berdi.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Parol muvaffaqiyatli yangilandi!</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Endi yangi parolingiz bilan tizimga kirishingiz mumkin.
        </p>
        <div className="mt-6">
          <Link href="/login" className="inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Tizimga kirish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {status === "error" && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {errorMsg}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
          Yangi parol
        </label>
        <div className="mt-2">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => { setPassword(e.target.value); setStatus("idle"); }}
            className="block w-full rounded-xl border-0 py-2.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white">
          Yangi parolni takrorlang
        </label>
        <div className="mt-2">
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setStatus("idle"); }}
            className="block w-full rounded-xl border-0 py-2.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        {status === "loading" ? "Saqlanmoqda..." : "Parolni saqlash"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center bg-zinc-50 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Yangi parol o'rnatish
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-2xl sm:px-12 dark:bg-zinc-900/50 dark:ring-1 dark:ring-zinc-800">
          <Suspense fallback={<div className="text-center">Yuklanmoqda...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
