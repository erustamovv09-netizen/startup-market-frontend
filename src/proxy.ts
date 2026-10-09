import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Barcha foydalanuvchilar (kirmaganlar) uchun OCHIQ sahifalar
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access")?.value;

  // Agar sahifa ochiq sahifalardan biri bo'lsa
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublic) {
    // Agar foydalanuvchi tizimga kirgan bo'lsa va login/register ga o'tmoqchi bo'lsa
    // uni asosiy sahifaga qaytarib yuboramiz (UX uchun yaxshi)
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // Kirmaganlar login/register qila olishi uchun ruxsat
    return NextResponse.next();
  }

  // Agar foydalanuvchi yuqoridagi OCHIQ sahifalarda BO'LMASA, 
  // demak u yopiq platforma qismida (shuning uchun login qilgan bo'lishi shart)
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?error=login_required";
    return NextResponse.redirect(url);
  }

  // Agar token bo'lsa barcha sahifalar ochiq
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
