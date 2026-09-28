import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

// TypeScript'da session va token maydonlarini xatosiz tanitish uchun
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string;
  }
}

console.log("Loaded GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Loaded GOOGLE_CLIENT_SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length);

const handler = NextAuth({
  // Session strategiyasini eksplitsit JWT deb belgilaymiz
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Dastlabki kiringanda token va user ma'lumotlarini saqlab qolamiz
      if (account && user) {
        console.log("Google User:", user.email);
        // API URL ni aniqlash (fallback bilan)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        let res: Response | null = null;
        try {
          // Backendga foydalanuvchi ma'lumotlarini yuborib tokenni olish
          res = await fetch(`${apiUrl}/api/google-login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, name: user.name }),
          });
        } catch (fetchError: any) {
          console.error("Backend fetch xatosi (Tarmoq xatosi/ECONNRESET):", fetchError.message || fetchError);
        }

        if (res) {
          console.log("Django Response Status:", res.status);
          if (res.ok) {
            try {
              const data = await res.json();
              console.log("Django Token Data:", data);
              // Django qaytargan 'access' va 'refresh' tokenlarni saqlash
              token.accessToken = data.access;
              if (data.refresh) {
                token.refreshToken = data.refresh;
              }
            } catch (jsonErr: any) {
              console.error("JSON parchalash xatosi:", jsonErr.message);
              token.accessToken = undefined;
              token.refreshToken = undefined;
            }
          } else {
            const errorData = await res.text();
            console.error("Django qaytargan xato:", errorData);
            token.accessToken = undefined; // Xatolik bo'lsa token bo'sh qolishi kerak
            token.refreshToken = undefined;
          }
        } else {
          token.accessToken = undefined;
          token.refreshToken = undefined;
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // JWT tokenni frontend (mijoz) uchun sessionga o'tkazamiz
      if (session.user) {
        session.user.id = token.id;
        session.accessToken = token.accessToken; // Bu qat'iy Django tokeni bo'lishi shart
        session.refreshToken = token.refreshToken;
      }
      console.log("Final Session Token:", session.accessToken);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Login sahifasiga qayta yo'naltirish tsiklini to'xtatish
      if (url.includes("/login")) {
        return baseUrl;
      }
      // To'g'ridan-to mehmonga/bosh sahifaga (/) yoki ruxsat etilgan URL'ga qaytarish
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };