import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tariflar | StartUp Market",
  description: "StartUp Market platformasidagi e'lon berish tariflari va ularning afzalliklari.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-base font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Narxlar</h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Sizning loyihangiz uchun mos tarif
          </p>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            StartUp Market hozirda bepul ishlamoqda, lekin tez orada premium xizmatlarni taklif qilamiz.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-16">
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          
          {/* Boshlang'ich (Free) Card */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div>
              <h3 className="text-2xl font-bold leading-8 text-zinc-900 dark:text-white">
                Boshlang&apos;ich
              </h3>
              <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Oddiy e&apos;lonlar va platformaning asosiy imkoniyatlaridan foydalanish uchun.
              </p>
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">$0</span>
                <span className="text-sm font-semibold leading-6 text-zinc-600 dark:text-zinc-400">/oy</span>
              </div>
              <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-x-3 items-center">
                  <svg className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Bepul e&apos;lon berish
                </li>
                <li className="flex gap-x-3 items-center">
                  <svg className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Asosiy qidiruv tizimi
                </li>
                <li className="flex gap-x-3 items-center">
                  <svg className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Telegram orqali xabarnomalar
                </li>
              </ul>
            </div>
            <a
              href="/create"
              className="mt-8 block w-full rounded-xl bg-indigo-50 px-3 py-3 text-center text-sm font-semibold leading-6 text-indigo-600 shadow-sm transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            >
              Hozir boshlash
            </a>
          </div>

          {/* Premium Card */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 shadow-2xl shadow-indigo-500/30 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/50">
            <div className="absolute top-0 right-6 translate-y-[-50%] rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-600 shadow-lg">
              Tez kunda
            </div>
            <div>
              <h3 className="text-2xl font-bold leading-8 text-white">
                Premium
              </h3>
              <p className="mt-4 text-sm leading-6 text-indigo-100">
                Kengaytirilgan imkoniyatlar orqali loyihangizni tezroq va qimmatroq soting.
              </p>
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-extrabold tracking-tight text-white/50 blur-[2px]">$$$</span>
              </div>
              <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-indigo-100">
                <li className="flex gap-x-3 items-center">
                  <svg className="h-6 w-5 flex-none text-indigo-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  VIP e&apos;lonlar (Bosh sahifada)
                </li>
                <li className="flex gap-x-3 items-center">
                  <svg className="h-6 w-5 flex-none text-indigo-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Qidiruvda doim yuqorida turish
                </li>
                <li className="flex gap-x-3 items-center">
                  <svg className="h-6 w-5 flex-none text-indigo-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Batafsil ko&apos;rishlar analitikasi
                </li>
              </ul>
            </div>
            <button
              disabled
              className="mt-8 block w-full rounded-xl bg-white/10 px-3 py-3 text-center text-sm font-semibold leading-6 text-white backdrop-blur-md transition hover:bg-white/20 cursor-not-allowed"
            >
              Hali mavjud emas
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
