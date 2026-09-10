import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Bu yerda ixtiyoriy ravishda secret, session va callbacks sozlamalari kiritilishi mumkin.
  secret: process.env.NEXTAUTH_SECRET, // Ishlab chiqarish muhitida kerak
});

export { handler as GET, handler as POST };
