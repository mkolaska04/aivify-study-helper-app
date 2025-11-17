import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { BackendAdapter } from "./lib/backend-adapter"

// Initialize NextAuth handler and export it as GET/POST handlers
const nextAuthHandler = NextAuth({
  adapter: BackendAdapter(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // extend session.user with id for app usage
        ;(session.user as any).id = user.id
      }
      return session
    },
  },
})

export const handlers = {
  GET: nextAuthHandler,
  POST: nextAuthHandler,
}

export default nextAuthHandler
