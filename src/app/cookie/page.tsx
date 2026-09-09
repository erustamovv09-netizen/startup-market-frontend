import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie siyosati | StartUp Market",
  description: "StartUp Market platformasida cookie fayllaridan foydalanish qoidalari.",
};

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Cookie siyosati
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Saytimizda ma&apos;lumotlarni saqlash va qulaylik yaratish tartibi.
          </p>
        </div>
      </div>

      {/* Floating Paper Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-16">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:p-12 mb-20 relative overflow-hidden">
          {/* Glassmorphism gradient orb */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
          
          <div className="relative z-10 prose prose-lg prose-indigo max-w-none text-zinc-600 dark:prose-invert dark:text-zinc-300">
            <div className="flex items-start gap-5 p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex-shrink-0 bg-white dark:bg-zinc-700 p-3 rounded-full shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="m-0 text-lg leading-relaxed pt-1 font-medium text-zinc-700 dark:text-zinc-300">
                StartUp Market platformasi sizga qulaylik yaratish, tizimga kirish ma&apos;lumotlarini (sessiya va avtorizatsiya tokenlari) saqlash va sayt tezligini oshirish maqsadida cookie fayllaridan foydalanadi. Tizimdan foydalanish orqali siz bunga o&apos;z roziligingizni bildirasiz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
