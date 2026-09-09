import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qanday ishlaydi? | StartUp Market",
  description: "StartUp Market platformasida IT loyihalar va bizneslarni sotish yoki sotib olish qanday amalga oshiriladi?",
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Ro'yxatdan o'ting",
      description: "Saytimizda tez va oson ro'yxatdan o'tib, shaxsiy profilingizni yarating.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Loyihangizni joylashtiring",
      description: "Loyiha nomi, narxi, texnologiyalari va demo havolalarini kiritib e'lon bering.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Xaridorlar bilan bog'laning",
      description: "Qiziqish bildirgan investorlar va xaridorlar bilan to'g'ridan-to'g'ri savdolashing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
              StartUp Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">qanday ishlaydi?</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Bizning platformamiz orqali o&apos;z IT loyihangizni sotish yoki tayyor biznes sotib olish uchta oddiy qadamdan iborat.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center p-8 bg-white dark:bg-zinc-900/50 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 transition-transform hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 group">
              <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                <span className="font-bold">{step.number}</span>
              </div>
              <div className="mt-6 mb-6 text-indigo-600 dark:text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 text-center">
                {step.title}
              </h3>
              <p className="text-center text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
