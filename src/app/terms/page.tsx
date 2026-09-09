import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foydalanish shartlari | StartUp Market",
  description: "StartUp Market platformasidan foydalanish shartlari va qoidalari.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Foydalanish shartlari
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Platformamizdan xavfsiz va to&apos;g&apos;ri foydalanish qoidalari.
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
              Ushbu platformadan foydalanish orqali siz quyidagi shartlarga to&apos;liq rozi bo&apos;lasiz:
            </p>
            
            <ul className="space-y-6 text-lg leading-relaxed list-none p-0 mt-8">
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Foydalanuvchilar faqat o&apos;zlariga tegishli bo&apos;lgan yoki sotish huquqiga ega bo&apos;lgan loyihalarni joylashtirishi shart. Birovning intellektual mulkini o&apos;zlashtirish taqiqlanadi.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Boshqa foydalanuvchilar bilan muloqotda o&apos;zaro hurmatni saqlash, haqoratli so&apos;zlardan foydalanmaslik qat&apos;iy talab etiladi. Qoidabuzarlar darhol va ogohlantirishsiz bloklanadi.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span>Sayt ma&apos;muriyati foydalanuvchilar kiritgan ma&apos;lumotlarning 100% to&apos;g&apos;riligiga kafolat bermaydi. Platforma faqat axborot vositachisi vazifasini o&apos;taydi. Har qanday xarid oldidan loyihani o&apos;zingiz mustaqil ravishda tekshirib olishingizni so&apos;raymiz.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
