"use client";
import React from "react";
import Link from "next/link";

export default function BlogPage() {
  const today = new Date();
  
  const posts = [
    {
      id: 1,
      title: "O'zbekistonda IT Startaplar bozori: joriy yil tendensiyalari",
      href: "#",
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }),
      datetime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: { title: "Tahlil", href: "#", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
      excerpt: "Joriy yilda O'zbekistonda IT startaplar bozorida keskin o'sish kuzatilmoqda. Ayniqsa, sun'iy intellekt va moliya texnologiyalari yo'nalishidagi loyihalarga investorlar qiziqishi ortgan. Maqolada asosiy sabablar va istiqbollar tahlil qilinadi.",
      author: {
        name: "StartUp Market Jamoasi",
        role: "Tahlilchi",
      },
    },
    {
      id: 2,
      title: "Tayyor biznesni sotib olishda nimalarga e'tibor berish kerak?",
      href: "#",
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }),
      datetime: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      category: { title: "Qo'llanma", href: "#", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" },
      imageUrl: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800",
      excerpt: "Tayyor biznes sotib olish noldan boshlashga nisbatan xavfsizroq ko'rinishi mumkin, ammo yashirin xavflar ham talaygina. Ushbu qo'llanmada moliyaviy hisobotlarni tekshirish va mijozlar bazasini baholash kabi eng muhim qadamlar ko'rib chiqiladi.",
      author: {
        name: "StartUp Market Jamoasi",
        role: "Ekspert",
      },
    },
    {
      id: 3,
      title: "Nima uchun SaaS loyihalar hozir eng daromadli?",
      href: "#",
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }),
      datetime: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      category: { title: "Biznes", href: "#", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" },
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      excerpt: "SaaS (Software as a Service) loyihalari bugungi kunda barqaror daromad keltiruvchi eng jozibador biznes modellaridan biri hisoblanadi. Oylik obunalar tizimi biznesning kelajagini bashorat qilishga qanday yordam berishi haqida batafsil ma'lumot.",
      author: {
        name: "StartUp Market Jamoasi",
        role: "Ekspert",
      },
    },
  ];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Bizning Blog</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            Platforma yangiliklari va maqolalar
          </p>
          <p className="mt-4 md:mt-6 mx-auto max-w-2xl text-base md:text-lg leading-7 md:leading-8 text-zinc-600 dark:text-zinc-400">
            Startaplar, IT biznes, tahlillar va investitsiyalar olamidagi eng so&apos;nggi tendensiyalar bilan tanishing.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid max-w-2xl grid-cols-1 gap-8 mx-auto md:max-w-none md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 group">
              {/* Image */}
              <div className="w-full aspect-video overflow-hidden bg-slate-100 dark:bg-zinc-800 relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    <Link href={`/blog/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="relative mt-6 flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 w-full">
                  <div className="flex items-center gap-x-4">
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
                  
                  <Link href={`/blog/${post.id}`} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors z-10 relative">
                    Batafsil o&apos;qish &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
