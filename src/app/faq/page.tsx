import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ko'p beriladigan savollar | StartUp Market",
  description: "StartUp Market platformasi bo'yicha ko'p beriladigan savollarga javoblar.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Platformadan foydalanish qanday amalga oshiriladi?",
      answer: "Saytda ro'yxatdan o'tasiz, o'z loyihangiz ma'lumotlarini (nomi, narxi, demo havolalari) kiritasiz va e'lonni chop etasiz. Xaridorlar siz bilan to'g'ridan-to'g'ri bog'lanishadi.",
    },
    {
      question: "E'lon berish bepulmi?",
      answer: "Ha, hozirgi kunda platformamizda e'lon joylashtirish mutlaqo bepul.",
    },
    {
      question: "Oldi-sotdi jarayoniga sayt aralashadimi?",
      answer: "Yo'q, StartUp Market faqatgina ma'lumotlar maydoni hisoblanadi. To'lov va loyihani topshirish jarayonlari xaridor va sotuvchi o'rtasida mustaqil amalga oshiriladi.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Ko&apos;p beriladigan savollar (FAQ)
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Sizni qiziqtirgan barcha savollarga shu yerda javob topishingiz mumkin.
          </p>
        </div>
      </div>

      {/* Floating FAQ Cards */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-16">
        <div className="space-y-6 mb-20 relative z-10">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 font-extrabold text-sm">
                  Q
                </span>
                <span className="pt-1">{faq.question}</span>
              </h3>
              <p className="pl-12 text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
