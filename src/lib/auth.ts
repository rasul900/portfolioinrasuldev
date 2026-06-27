import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL ?? "admin@rasuldev.uz";
        const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (credentials?.email !== adminEmail) return null;

        if (adminHash) {
          const valid = await bcrypt.compare(
            credentials.password as string,
            adminHash
          );
          if (!valid) return null;
        } else if (credentials?.password !== adminPassword) {
          return null;
        }

        return { id: "1", email: adminEmail, role: "admin", name: "Admin" };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (path === "/admin/login") return true;
      if (path.startsWith("/admin")) {
        return !!auth?.user;
      }
      return true;
    },
  },
});
