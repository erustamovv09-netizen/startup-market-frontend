"use client";
import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Bu joyda markazlashtirilgan API dan yoki bazadan ma'lumot olish kerak bo'ladi,
// hozircha statik mock data dan foydalanamiz
const getPostById = (id: string) => {
  const today = new Date();
  const posts = [
    {
      id: "1",
      title: "O'zbekistonda IT Startaplar bozori: joriy yil tendensiyalari",
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }),
      datetime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: { title: "Tahlil", href: "#", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Joriy yilda O'zbekistonda IT startaplar bozorida keskin o'sish kuzatilmoqda. Ayniqsa, sun'iy intellekt va moliya texnologiyalari yo'nalishidagi loyihalarga investorlar qiziqishi ortgan. Maqolada asosiy sabablar va istiqbollar tahlil qilinadi.",
      content: `
        O'zbekiston IT bozorida katta o'zgarishlar va jadal o'sish davri kuzatilmoqda. Ayniqsa so'nggi bir necha yil ichida axborot texnologiyalari sohasiga qaratilayotgan e'tibor va sarmoyalar hajmining oshishi ko'plab yangi startap loyihalarning paydo bo'lishiga zamin yaratdi.

        ### Asosiy tendensiyalar
        1. **Sun'iy Intellekt (AI)**: Mahalliylashtirilgan AI xizmatlari va til modellari asosidagi ilovalar jadal o'smoqda.
        2. **FinTech (Moliya texnologiyalari)**: To'lov tizimlari, raqamli banklar va mikromoliya xizmatlari hanuzgacha eng ko'p sarmoya jalb qilayotgan sohalar qatorida.
        3. **EdTech (Ta'lim texnologiyalari)**: Onlayn ta'lim platformalari va kasb-hunar o'rgatuvchi tizimlarga talab kundan kunga oshib bormoqda.
        4. **E-commerce (Elektron tijorat)**: Logistika va B2B savdo maydonchalari ekotizimni kengaytirmoqda.

        Investorlar faqatgina g'oyaga emas, balki real daromad keltira oladigan (revenue-generating) va prototipi (MVP) mavjud bo'lgan loyihalarga qiziqish bildirmoqdalar. Startap asoschilari endilikda biznes modellarini aniq shakllantirgan holda bozorga kirishlari tavsiya etiladi.
      `,
      author: {
        name: "StartUp Market Jamoasi",
        role: "Tahlilchi",
      },
    },
    {
      id: "2",
      title: "Tayyor biznesni sotib olishda nimalarga e'tibor berish kerak?",
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }),
      datetime: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      category: { title: "Qo'llanma", href: "#", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" },
      imageUrl: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=1200",
      excerpt: "Tayyor biznes sotib olish noldan boshlashga nisbatan xavfsizroq ko'rinishi mumkin, ammo yashirin xavflar ham talaygina. Ushbu qo'llanmada moliyaviy hisobotlarni tekshirish va mijozlar bazasini baholash kabi eng muhim qadamlar ko'rib chiqiladi.",
      content: `
        Tayyor biznes yoki daromad keltirayotgan IT loyihani (SaaS, Telegram bot, veb-sayt) sotib olish juda jozibador ko'rinadi. Sababi, siz noldan boshlamaysiz, mijozlar bazasi va tayyor mahsulotga ega bo'lasiz. Ammo bu jarayonda e'tibor berish kerak bo'lgan juda muhim jihatlar mavjud.

        ### 1. Moliyaviy hisobotlarni tahlil qilish
        Loyiha egasi aytayotgan foyda har doim ham haqiqatga to'g'ri kelmasligi mumkin. Oylik xarajatlar (server, APIlar, xodimlar maoshi, marketing) to'liq hisobga olinganiga ishonch hosil qiling.

        ### 2. Kod va texnik qarzlarni tekshirish
        Loyiha kodi qanchalik toza yozilgan? Agar u chalkash yoki eskirgan texnologiyalarda yozilgan bo'lsa, kelajakda uni qo'llab-quvvatlash uchun juda ko'p pul va vaqt sarflashingizga to'g'ri keladi.

        ### 3. Mijozlar bazasi va LTV
        Loyiha qanday qilib daromad qilmoqda? Bir martalik xaridlarmi yoki obunami? Foydalanuvchilar qanchalik tez tark etadi (Churn rate)? Shu kabi ko'rsatkichlarni (metrics) sinchiklab o'rganib chiqing.

        Har qanday oldi-sotdi jarayonida mutaxassislar (huquqshunos va texnik ekspert) yordamidan foydalanishni unutmang.
      `,
      author: {
        name: "StartUp Market Jamoasi",
        role: "Ekspert",
      },
    },
    {
      id: "3",
      title: "Nima uchun SaaS loyihalar hozir eng daromadli?",
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" }),
      datetime: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      category: { title: "Biznes", href: "#", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" },
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      excerpt: "SaaS (Software as a Service) loyihalari bugungi kunda barqaror daromad keltiruvchi eng jozibador biznes modellaridan biri hisoblanadi. Oylik obunalar tizimi biznesning kelajagini bashorat qilishga qanday yordam berishi haqida batafsil ma'lumot.",
      content: `
        SaaS (Software as a Service - xizmat sifatida dasturiy ta'minot) biznes modeli investorlar va asoschilar uchun eng sevimli modellardan biri hisoblanadi. Buning sababi juda oddiy: barqarorlik va bashorat qilinadigan daromad.

        ### MRR va ARR tushunchalari
        Oylik takrorlanuvchi daromad (MRR) va yillik takrorlanuvchi daromad (ARR) loyiha qiymatini belgilovchi eng asosiy ko'rsatkichlardir. Agar sizda har oy obuna to'lovini to'laydigan 100 ta mijozingiz bo'lsa, har oygi foydangiz aniq bo'ladi va yangi funksiyalar qo'shish uchun budjetni to'g'ri taqsimlay olasiz.

        ### B2B vs B2C
        Odatda B2B (biznesdan biznesga) SaaS loyihalar B2C (biznesdan iste'molchiga) ga nisbatan uzoqroq umr ko'radi va obuna narxlari ham yuqoriroq bo'ladi. Bizneslar uchun asbob yaratish har doim qadrliroqdir.

        Shu sababli ham tayyor SaaS loyihalari StartUp Market platformasida ham eng tez sotiladigan aktivlar ro'yxatida yetakchilik qilmoqda.
      `,
      author: {
        name: "StartUp Market Jamoasi",
        role: "Ekspert",
      },
    },
  ];

  return posts.find((p) => p.id === id) || null;
};

export default function BlogPostDetail({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object (required in Next.js 15+)
  const { id } = use(params);
  const post = getPostById(id);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    // 1. Try Native Web Share API if supported
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: post?.title || "Blog",
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // User cancelled sharing
      }
    }

    // 2. Try Modern Clipboard API if supported in current context
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        triggerToast("Havola buferga nusxalandi (HTTPS serverda ilovalar menyusi ochiladi)");
        return;
      } catch (err) {
        console.warn("Clipboard API failed, using fallback:", err);
      }
    }

    // 3. Legacy Fallback for HTTP / non-secure contexts
    try {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      triggerToast("Havola buferga nusxalandi (HTTPS serverda ilovalar menyusi ochiladi)");
    } catch (err) {
      console.error("Havolani nusxalash imkoni bo'lmadi", err);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 max-w-lg w-full">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">Maqola topilmadi</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
          <Link href="/blog" className="inline-flex justify-center w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-md active:scale-[0.98]">
            &larr; Barcha maqolalarga qaytish
          </Link>
        </div>
      </div>
    );
  }

  // Paragraphlarni va headinglarni formatlash
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, idx) => {
      const p = paragraph.trim();
      if (!p) return null;
      
      if (p.startsWith('###')) {
        return (
          <h3 key={idx} className="text-2xl font-bold text-zinc-900 dark:text-white mt-10 mb-4">
            {p.replace('###', '').trim()}
          </h3>
        );
      }
      if (/^\d+\./.test(p)) {
        return (
          <p key={idx} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 pl-4 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 py-2">
            {p}
          </p>
        );
      }
      return (
        <p key={idx} className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 text-lg">
          {p}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      {/* Cover Image Header */}
      <div className="w-full h-80 md:h-[450px] relative overflow-hidden bg-zinc-900 flex items-end">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200";
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-transparent"></div>
        
        {/* Header Content overlay */}
        <div className="relative z-10 w-full pt-8 pb-16 sm:pb-24 px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-300 hover:text-white mb-4 transition-colors font-medium w-max">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Orqaga
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className={`px-3 py-1 rounded-full bg-indigo-600 text-white shadow-sm`}>
                {post.category.title}
              </span>
              <div className="flex items-center gap-2 text-zinc-300 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <time>{post.date}</time>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        {/* Main Content */}
        <div className="relative -mt-6 sm:-mt-16 bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-8 shadow-sm max-w-4xl mx-auto z-10">
          {/* Author info */}
          <div className="flex items-center gap-4 pb-8 mb-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="h-14 w-14 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-800">
              <span className="font-bold text-lg">SM</span>
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white text-lg">{post.author.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">{post.author.role}</p>
            </div>
          </div>

          <article className="prose prose-lg dark:prose-invert prose-indigo max-w-none">
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium mb-10 pb-10 border-b border-zinc-100 dark:border-zinc-800">
              {post.excerpt}
            </p>
            
            <div className="mt-8">
              {formatContent(post.content)}
            </div>
          </article>
          
          {/* Bottom Action */}
          <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center flex-wrap gap-4">
            <Link href="/blog" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl transition-all active:scale-[0.98]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Orqaga qaytish
            </Link>
            
            <button onClick={handleShare} className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              Ulashish
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm">
          <svg className="w-5 h-5 flex-shrink-0 text-emerald-400 dark:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          <span className="font-semibold text-sm leading-tight">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
