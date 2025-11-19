import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters"

// Use localhost for server-side requests (Next.js SSR)
const API_URL = 'http://localhost:4000';

export function BackendAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const res = await fetch(`${API_URL}/api/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await res.json();
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      try {
        const res = await fetch(`${API_URL}/api/auth/user/${id}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      try {
        const res = await fetch(`${API_URL}/api/auth/user/email/${encodeURIComponent(email)}`);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<AdapterUser | null> {
      try {
        const res = await fetch(`${API_URL}/api/auth/account/${provider}/${providerAccountId}`);
        if (!res.ok) return null;
        const account = await res.json();
        return account.user;
      } catch {
        return null;
      }
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      const res = await fetch(`${API_URL}/api/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await res.json();
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount | null | undefined> {
      const res = await fetch(`${API_URL}/api/auth/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
      return await res.json();
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
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

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
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

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> {
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

    async deleteSession(sessionToken: string): Promise<void> {
      await fetch(`${API_URL}/api/auth/session/${sessionToken}`, {
        method: 'DELETE',
      });
    },

    async createVerificationToken(token: VerificationToken): Promise<VerificationToken | null | undefined> {
      // Not implemented for OAuth
      return token as VerificationToken;
    },

    async useVerificationToken(_params: { identifier: string; token: string }): Promise<VerificationToken | null> {
      // Not implemented for OAuth
      return null;
    },
  }
}
