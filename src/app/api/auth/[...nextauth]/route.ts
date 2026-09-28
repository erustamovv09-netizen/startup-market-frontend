import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
              // QAT'IY: Faqatgina Django qaytargan 'access' tokenni saqlash kerak
              token.accessToken = data.access;
            } catch (jsonErr: any) {
              console.error("JSON parchalash xatosi:", jsonErr.message);
              token.accessToken = undefined;
            }
          } else {
            const errorData = await res.text();
            console.error("Django qaytargan xato:", errorData);
            token.accessToken = undefined; // Xatolik bo'lsa token bo'sh qolishi kerak
          }
        } else {
          token.accessToken = undefined;
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // JWT tokenni frontend (mijoz) uchun sessionga o'tkazamiz
      if (session.user) {
        (session.user as any).id = token.id;
        (session as any).accessToken = token.accessToken; // Bu qat'iy Django tokeni bo'lishi shart
      }
      console.log("Final Session Token:", (session as any).accessToken);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // To'g'ridan-to'g'ri bosh sahifaga (/) yoki ruxsat etilgan URL'ga qaytarish
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
