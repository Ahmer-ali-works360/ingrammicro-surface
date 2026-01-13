// src/app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  role: string | null;
  status: string | null;
  loading: boolean;
  setUser: (user: any | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Function to fetch user profile from Supabase
  const fetchProfile = async (userData: any) => {
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", userData.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        setRole(null);
        setStatus(null);
      } else {
        setRole(profileData.role);
        setStatus(profileData.status);
        console.log("AuthContext - Fetched role:", profileData.role);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      setRole(null);
      setStatus(null);
    }
  };

  useEffect(() => {
    setLoading(true);

    // ✅ Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setRole(null);
        setStatus(null);
      }

      setLoading(false);
    };

    getSession();

    // ✅ Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(true);
        await fetchProfile(session.user); // ✅ fetch role immediately after login
        setLoading(false);
      } else {
        setUser(null);
        setRole(null);
        setStatus(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, status, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
