import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz haqimizda | StartUp Market",
  description: "StartUp Market — O'zbekistondagi IT loyihalar, tayyor bizneslar va startaplar oldi-sotdi qilinadigan birinchi raqamli ochiq platforma.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Biz haqimizda
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Iqtidorli dasturchilar, g&apos;oyalar mualliflari va tadbirkorlarni investorlar bilan birlashtiruvchi markaz.
          </p>
        </div>
      </div>

      {/* Floating Paper Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-16">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:p-12 mb-20 relative overflow-hidden">
          {/* Glassmorphism gradient orb */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
          
          <div className="relative z-10 prose prose-lg prose-indigo max-w-none text-zinc-600 dark:prose-invert dark:text-zinc-300">
            <p className="mb-8 text-xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              StartUp Market — O&apos;zbekistondagi IT loyihalar, tayyor bizneslar va startaplar oldi-sotdi qilinadigan birinchi raqamli ochiq platforma.
            </p>
            <p className="mb-6 leading-relaxed">
              Bizning asosiy maqsadimiz — iqtidorli dasturchilar, g&apos;oyalar mualliflari va tadbirkorlarni investorlar hamda xaridorlar bilan xavfsiz va qulay muhitda birlashtirishdir. Biz ishonamizki, har bir yaxshi g&apos;oya va sifatli yozilgan kod o&apos;z xaridorini topishi kerak.
            </p>
            <p className="leading-relaxed">
              Biz orqali siz o&apos;zingizning tayyor veb-saytingiz, mobil ilovangiz, Telegram botingiz yoki SaaS loyihangizni tez va oson sotishingiz, shuningdek, biznesingiz uchun tayyor yechimlarni xarid qilishingiz mumkin. Platformamiz har ikki tomon uchun ham shaffof va ochiq ma&apos;lumotlar bazasini taqdim etadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
