import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserAddress } from "@/types";

type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  profilePicture?: string;
  addresses: UserAddress[];
  isAdmin?: boolean;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  signup: (email: string, password: string, name?: string, phone?: string, gender?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({ id: data.user.id, email: data.user.email, addresses: [], isAdmin: data.user.email === "casandra@gmail.com" });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("Login error:", error);
        throw new Error("Invalid email or password.");
      }

      if (!data.user) throw new Error("Authentication failed. Please try again.");

      const isAdmin = email === "casandra@gmail.com";
      setUser({ id: data.user.id, email: data.user.email, addresses: [], isAdmin });

      toast.success("Successfully logged in");

      return { isAdmin };
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Invalid email or password.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string, phone?: string, gender?: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone, gender } }
      });

      if (error) throw error;

      toast.success("Account created. Please check your email to verify.");
    } catch (error: any) {
      toast.error(error.message || "Signup failed.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
