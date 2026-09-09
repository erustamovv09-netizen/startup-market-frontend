import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati | StartUp Market",
  description: "StartUp Market platformasining maxfiylik siyosati va foydalanuvchi ma'lumotlarini himoya qilish qoidalari.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Maxfiylik siyosati
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Sizning shaxsiy ma&apos;lumotlaringiz qanday himoya qilinishi haqida.
          </p>
        </div>
      </div>

      {/* Floating Paper Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-16">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:p-12 mb-20 relative overflow-hidden">
          {/* Glassmorphism gradient orb */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
          
          <div className="relative z-10 prose prose-lg prose-indigo max-w-none text-zinc-600 dark:prose-invert dark:text-zinc-300">
            
            <div className="flex items-center gap-4 mb-10 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
              <div className="bg-white dark:bg-indigo-800 p-3 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600 dark:text-indigo-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <p className="m-0 text-xl font-semibold text-indigo-900 dark:text-indigo-100">
                Sizning xavfsizligingiz biz uchun muhim.
              </p>
            </div>

            <p className="mb-6 text-lg leading-relaxed">
              Biz platformada ro&apos;yxatdan o&apos;tish paytida kiritilgan email va boshqa shaxsiy ma&apos;lumotlarni uchinchi shaxslarga mutlaqo sotmaymiz yoki tarqatmaymiz.
            </p>
            <p className="text-lg leading-relaxed">
              Email manzilingiz faqatgina saytdagi muhim yangiliklar, xaridorlar xabarlari yoki admin xabarnomalari uchun ishlatiladi. Platformadagi barcha xabarlar va parollar zamonaviy shifrlash usullari bilan himoyalangan va ishonchli serverlarda saqlanadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
