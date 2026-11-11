import React, { createContext, useContext, useEffect, useState } from "react";
import { api, type ApiUser } from "../lib/api";

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
    community?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: Partial<ApiUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on initial load or page refresh
  const refreshUser = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    if (res.user) {
      setUser(res.user);
    }
  };

  const signup = async (payload: {
    name: string;
    email: string;
    password: string;
    community?: string;
  }) => {
    const res = await api.auth.register(payload);
    if (res.user) {
      setUser(res.user);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Clean up even if network error
    } finally {
      setUser(null);
      localStorage.removeItem("sharenest_token");
    }
  };

  const updateProfile = async (payload: Partial<ApiUser>) => {
    const res = await api.auth.updateProfile(payload);
    if (res.user) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
