import type { Adapter, VerificationToken } from "next-auth/adapters"

// Use localhost for server-side requests (Next.js SSR)
const API_URL = 'http://localhost:4000';

export function BackendAdapter(): Adapter {
  return {
    async createUser(user) {
      const res = await fetch(`${API_URL}/api/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await res.json();
    },

    async getUser(id) {
      try {
        const res = await fetch(`${API_URL}/api/auth/user/${id}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    async getUserByEmail(email) {
      try {
        const res = await fetch(`${API_URL}/api/auth/user/email/${encodeURIComponent(email)}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const res = await fetch(`${API_URL}/api/auth/account/${provider}/${providerAccountId}`);
        if (!res.ok) return null;
        const account = await res.json();
        return account.user;
      } catch {
        return null;
      }
    },

    async updateUser(user) {
      const res = await fetch(`${API_URL}/api/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await res.json();
    },

    async linkAccount(account) {
      const res = await fetch(`${API_URL}/api/auth/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
      return await res.json();
    },

    async createSession(session) {
      const res = await fetch(`${API_URL}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session,
          expires: session.expires instanceof Date 
            ? session.expires.toISOString() 
            : session.expires,
        }),
      });
      const created = await res.json();
      return {
        ...created,
        expires: new Date(created.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
      try {
        const res = await fetch(`${API_URL}/api/auth/session/${sessionToken}`);
        if (!res.ok) return null;
        const session = await res.json();
        
        // Ensure expires is a Date object
        const expiresDate = typeof session.expires === 'string' 
          ? new Date(session.expires) 
          : session.expires;
        
        return {
          session: {
            sessionToken: session.sessionToken,
            userId: session.userId,
            expires: expiresDate,
          },
          user: session.user,
        };
      } catch {
        return null;
      }
    },

    async updateSession(session) {
      const res = await fetch(`${API_URL}/api/auth/session/${session.sessionToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          expires: session.expires instanceof Date 
            ? session.expires.toISOString() 
            : session.expires 
        }),
      });
      const updated = await res.json();
      return {
        ...updated,
        expires: new Date(updated.expires),
      };
    },

    async deleteSession(sessionToken) {
      await fetch(`${API_URL}/api/auth/session/${sessionToken}`, {
        method: 'DELETE',
      });
    },

    async createVerificationToken(token) {
      // Not implemented for OAuth
      return token as VerificationToken;
    },

    async useVerificationToken() {
      // Not implemented for OAuth
      return null;
    },
  }
}
