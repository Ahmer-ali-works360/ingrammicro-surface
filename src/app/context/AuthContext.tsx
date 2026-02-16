//src/app/context/AuthContext.tsx 

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any | null;
  role: string | null;
  status: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  syncSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("fetchProfile error:", error);
      return;
    }

    const normalizedRole = data?.role
      ?.toLowerCase()
      .replace(/\s+/g, "_");

    setRole(normalizedRole ?? null);
    setStatus(data?.status ?? null);
  };

  const syncSession = async () => {
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("getSession error:", error);
      setLoading(false);
      return;
    }

    if (!session?.user) {
      setUser(null);
      setRole(null);
      setStatus(null);
      setLoading(false);
      return;
    }

    setUser(session.user);
    await fetchProfile(session.user.id);
    setLoading(false);
  };

  const logout = async () => {
    try {
      // 1. Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }

      // 2. Clear localStorage
      localStorage.removeItem("cart");
      
      // 3. Clear state
      setUser(null);
      setRole(null);
      setStatus(null);

      // 4. ✅ CRITICAL FIX: Force clear all cookies manually
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Clear cookie with all possible paths and domains
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      }

      // 5. ✅ Call API route to clear server-side cookies
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' 
      });

      // 6. Hard redirect with cache clear
      router.refresh(); // Force middleware to re-run
      window.location.href = "/login";
      
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if error, still redirect
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    syncSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
        setStatus(null);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, status, loading, logout, syncSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const useAuthRole = (allowedRoles: string[]) => {
  const { role, loading } = useAuth();

  const userRole = role?.toLowerCase() ?? "";
  const isAllowed = allowedRoles
    .map((r) => r.toLowerCase())
    .includes(userRole);

  return { role: userRole, loading, isAllowed };
};