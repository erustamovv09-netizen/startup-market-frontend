import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | StartUp Market",
  description: "IT Startaplar, biznes oldi-sotdisi va so'nggi tendensiyalar haqida maqolalar.",
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "O'zbekistonda IT Startaplar bozori: 2026 yil tendensiyalari",
      href: "#",
      date: "Mar 16, 2026",
      datetime: "2026-03-16",
      category: { title: "Tahlil", href: "#", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
      gradient: "from-blue-400 to-indigo-500",
      author: {
        name: "StartUp Market Jamoasi",
        role: "Tahlilchi",
      },
    },
    {
      id: 2,
      title: "Tayyor biznesni sotib olishda nimalarga e'tibor berish kerak?",
      href: "#",
      date: "Mar 10, 2026",
      datetime: "2026-03-10",
      category: { title: "Qo'llanma", href: "#", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" },
      gradient: "from-emerald-400 to-teal-500",
      author: {
        name: "StartUp Market Jamoasi",
        role: "Ekspert",
      },
    },
    {
      id: 3,
      title: "Nima uchun SaaS loyihalar hozir eng daromadli?",
      href: "#",
      date: "Feb 28, 2026",
      datetime: "2026-02-28",
      category: { title: "Biznes", href: "#", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" },
      gradient: "from-purple-400 to-pink-500",
      author: {
        name: "StartUp Market Jamoasi",
        role: "Ekspert",
      },
    },
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-base font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Bizning Blog</h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Platforma yangiliklari va maqolalar
          </p>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Startaplar, IT biznes, tahlillar va investitsiyalar olamidagi eng so&apos;nggi tendensiyalar bilan tanishing.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-16">
        <div className="grid max-w-2xl grid-cols-1 gap-8 mx-auto lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between bg-white dark:bg-zinc-900 rounded-3xl shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 group">
              {/* Image/Gradient Placeholder */}
              <div className={`w-full h-48 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
              
              <div className="p-8 flex flex-col flex-1 w-full">
                <div className="flex items-center gap-x-4 text-xs mb-4">
                  <time dateTime={post.datetime} className="text-zinc-500 dark:text-zinc-400 font-medium">
                    {post.date}
                  </time>
                  <span className={`relative z-10 rounded-full px-3 py-1 font-semibold ${post.category.color}`}>
                    {post.category.title}
                  </span>
                </div>
                
                <div className="group relative flex-1">
                  <h3 className="mt-2 text-xl font-bold leading-7 text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    Maqolaning qisqacha mazmuni tez kunda to&apos;liq formatda taqdim etiladi. Tizimdagi so&apos;nggi yangiliklarni kuzatib boring va doim oldinda bo&apos;ling.
                  </p>
                </div>
                
                <div className="relative mt-8 flex items-center gap-x-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">SM</span>
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {post.author.name}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">{post.author.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
