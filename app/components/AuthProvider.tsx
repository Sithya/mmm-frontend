"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import type { CurrentUser } from "@/lib/auth";

type AuthContextShape = {
  user: CurrentUser | null;
  loading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (token: string, user?: Partial<CurrentUser> | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      if (res && (res as any).data) setUser((res as any).data as CurrentUser);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep auth in sync across tabs: listen for changes to authToken in localStorage
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'authToken') {
        // If token was removed, sign out locally
        if (!e.newValue) {
          setUser(null);
        } else {
          // A token was added/changed in another tab — refresh user
          load();
        }
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  const signIn = async (token: string, userArg?: Partial<CurrentUser> | null) => {
    // store token in apiClient/localStorage
    try {
      // set token immediately so subsequent calls use it
      // import is dynamic to avoid circular imports at module level
      const { apiClient } = await import('@/lib/api');
      apiClient.setAuthToken(token);
    } catch {
      // ignore
    }

    if (userArg) {
      // If we received a full user object (has required fields), set it directly.
      // Otherwise fall back to loading the full user from the API to ensure required fields are present.
      const maybe = userArg as Partial<CurrentUser>;
      if (maybe.id && maybe.email) {
        setUser(maybe as CurrentUser);
        return;
      }
      // else continue to load
    }

    // otherwise, fetch current user
    try {
      await load();
    } catch {
      // ignore
    }
  };

  const value: AuthContextShape = {
    user,
    loading,
    isAdmin: !!user?.is_admin,
    refresh: load,
    signOut,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return null;
  return <>{children}</>;
};

export default AuthProvider;
