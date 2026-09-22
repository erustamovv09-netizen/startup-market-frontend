import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie siyosati | StartUp Market",
  description: "StartUp Market platformasida cookie fayllaridan foydalanish qoidalari.",
};

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16 md:pb-24">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-6xl">
            Cookie siyosati
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg leading-7 md:leading-8 text-zinc-600 dark:text-zinc-400">
            Saytimizda ma&apos;lumotlarni saqlash va qulaylik yaratish tartibi.
          </p>
        </div>
      </div>

      {/* Floating Paper Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16">
        <div className="rounded-2xl md:rounded-3xl bg-white p-5 sm:p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:p-12 mb-16 relative overflow-hidden">

          {/* Glassmorphism gradient orb */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 prose prose-base md:prose-lg prose-indigo max-w-none text-zinc-600 dark:prose-invert dark:text-zinc-300">

            {/* Alert/Notice block — mobile friendly */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex-shrink-0 bg-white dark:bg-zinc-700 p-2.5 sm:p-3 rounded-full shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600 self-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="m-0 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-zinc-700 dark:text-zinc-300">
                StartUp Market platformasi sizga qulaylik yaratish, tizimga kirish ma&apos;lumotlarini (sessiya va avtorizatsiya tokenlari) saqlash va sayt tezligini oshirish maqsadida cookie fayllaridan foydalanadi. Tizimdan foydalanish orqali siz bunga o&apos;z roziligingizni bildirasiz.
              </p>
            </div>

            {/* Cookie types section */}
            <h2 className="mt-8 text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Qanday cookie fayllardan foydalanamiz?
            </h2>
            <div className="mt-4 grid gap-3 sm:gap-4">
              {[
                { title: "Zaruriy cookie'lar", desc: "Tizimga kirish, sessiya va xavfsizlik uchun zarur. Ularni o'chirib bo'lmaydi." },
                { title: "Funksional cookie'lar", desc: "Til, mavzu va foydalanuvchi sozlamalarini eslab qolish uchun ishlatiladi." },
                { title: "Tahliliy cookie'lar", desc: "Sayt trafigi va foydalanish statistikasini yig'ish uchun (anonim)." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-indigo-600 dark:text-indigo-400">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <p className="m-0 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{item.title}</p>
                    <p className="m-0 mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact section */}
            <p className="mt-8 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              Cookie siyosatimiz haqida savollaringiz bo&apos;lsa,{" "}
              <a href="mailto:e.rustamovv.09@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">
                e.rustamovv.09@gmail.com
              </a>{" "}
              manziliga murojaat qiling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
