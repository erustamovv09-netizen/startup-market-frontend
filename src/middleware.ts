import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PUBLIC ROUTES & STATIC FILES
  // Ruxsat berilgan hamma ko'ra oladigan sahifalar
  if (
    pathname === "/login" ||
    pathname === "/register"
  ) {
    // Agar foydalanuvchi allaqachon tizimga kirgan bo'lsa va login/register ga kirmoqchi bo'lsa
    // uni bosh sahifaga qaytarishimiz mumkin (ixtiyoriy, lekin yaxshi UX)
    const token = request.cookies.get("access")?.value;
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTES (Yopiq platforma)
  // Boshqa har qanday sahifa (/, /startups, /admin, /create) uchun token kerak
  const token = request.cookies.get("access")?.value;

  if (!token) {
    // Foydalanuvchida cookie token yo'q bo'lsa, avtomatik loginga qaytariladi
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?error=login_required";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match barcha yo'llar, lekin quyidagilarni istisno qiladi:
     * - api (Next.js backend api routes)
     * - _next/static (Statik fayllar, JS, CSS)
     * - _next/image (Rasm optimizatsiyasi)
     * - favicon.ico, sitemap.xml, robots.txt (Maxsus fayllar)
     * - Ochiq rasmlar va fayllar (.png, .jpg, .svg va h.k.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
