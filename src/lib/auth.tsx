import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { PlanId } from './plans';

/**
 * Demo-only "auth". Nothing is sent to any server and passwords are never stored:
 * a small profile object lives in localStorage so the dashboard has some state.
 */
export interface DemoUser {
  username: string;
  email: string;
  emailVerified: boolean;
  plan: PlanId | null;
  createdAt: string;
  userNumber: number;
  discordLinked: boolean;
  hwid: string | null;
  hwidResetAt: string | null;
}

interface AuthValue {
  user: DemoUser | null;
  signIn: (username: string, email?: string) => void;
  signOut: () => void;
  update: (patch: Partial<DemoUser>) => void;
}

const STORAGE_KEY = 'echo_demo_user';
const AuthContext = createContext<AuthValue | null>(null);

function loadUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

const newUser = (username: string, email: string): DemoUser => ({
  username,
  email,
  emailVerified: false,
  plan: null,
  createdAt: new Date().toISOString(),
  userNumber: Math.floor(Math.random() * 9000) + 1000,
  discordLinked: false,
  hwid: null,
  hwidResetAt: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(loadUser);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const signIn = useCallback((username: string, email = '') => {
    setUser((prev) =>
      prev && prev.username.toLowerCase() === username.toLowerCase() ? prev : newUser(username, email),
    );
  }, []);

  const signOut = useCallback(() => setUser(null), []);
  const update = useCallback(
    (patch: Partial<DemoUser>) => setUser((u) => (u ? { ...u, ...patch } : u)),
    [],
  );

  return <AuthContext.Provider value={{ user, signIn, signOut, update }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Simulated latency for demo interactions (no network involved). */
export const fakeDelay = (ms = 900) => new Promise<void>((resolve) => setTimeout(resolve, ms));
