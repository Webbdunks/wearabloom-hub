
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserAddress = {
  id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type: 'shipping' | 'billing';
};

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  profilePicture?: string;
  addresses: UserAddress[];
} | null;

type AuthContextType = {
  user: User | null;
  profile: UserProfile;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<Omit<UserProfile, 'id' | 'email' | 'addresses'>>) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Omit<UserAddress, 'id'>>) => void;
  removeAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check if user is admin when auth state changes
        if (currentSession?.user) {
          checkIsAdmin(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Then get the current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check if user is admin on initial load
      if (currentSession?.user) {
        checkIsAdmin(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile data when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        // For now, just mock the profile with the user data
        // In a real app, you'd fetch additional data from a profile table
        const mockAddresses = [
          {
            id: crypto.randomUUID(),
            fullName: user.user_metadata.name || user.email?.split('@')[0] || "",
            streetAddress: "123 Main St",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400001",
            country: "India",
            phone: "+91 9876543210",
            isDefault: true,
            type: 'shipping' as const
          }
        ];
        
        setProfile({
          id: user.id,
          email: user.email || "",
          name: user.user_metadata.name || user.email?.split('@')[0],
          profilePicture: user.user_metadata.avatar_url,
          addresses: mockAddresses
        });
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, [user]);

  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error: any) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<Omit<UserProfile, 'id' | 'email' | 'addresses'>>) => {
    if (user) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: userData,
        });
        
        if (error) {
          throw error;
        }
        
        if (profile) {
          const updatedProfile = { ...profile, ...userData };
          setProfile(updatedProfile);
        }
      } catch (error: any) {
        console.error("Failed to update profile:", error);
        throw error;
      }
    }
  };

  // These functions still use the local approach for addresses
  // In a real app, you'd save to a database table
  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (profile) {
      const newAddress = { ...address, id: crypto.randomUUID() };
      
      // If this is the first address or is marked default, make sure it's the only default
      const updatedAddresses = [...profile.addresses];
      
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr.type === newAddress.type) {
            addr.isDefault = false;
          }
        });
      }
      
      // If this is the first address of its type, make it default
      if (!updatedAddresses.some(addr => addr.type === newAddress.type)) {
        newAddress.isDefault = true;
      }
      
      updatedAddresses.push(newAddress);
      
      const updatedProfile = { ...profile, addresses: updatedAddresses };
      setProfile(updatedProfile);
    }
  };

  const updateAddress = (id: string, addressUpdate: Partial<Omit<UserAddress, 'id'>>) => {
    if (profile) {
      const updatedAddresses = [...profile.addresses];
      const index = updatedAddresses.findIndex(addr => addr.id === id);
      
      if (index !== -1) {
        const updatedAddress = { ...updatedAddresses[index], ...addressUpdate };
        updatedAddresses[index] = updatedAddress;
        
        // If setting this address as default, update other addresses of same type
        if (addressUpdate.isDefault) {
          updatedAddresses.forEach((addr, i) => {
            if (i !== index && addr.type === updatedAddress.type) {
              addr.isDefault = false;
            }
          });
        }
        
        const updatedProfile = { ...profile, addresses: updatedAddresses };
        setProfile(updatedProfile);
      }
    }
  };

  const removeAddress = (id: string) => {
    if (profile) {
      const filteredAddresses = profile.addresses.filter(addr => addr.id !== id);
      const updatedProfile = { ...profile, addresses: filteredAddresses };
      setProfile(updatedProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
      isLoading, 
      isAdmin,
      login, 
      signupWithEmail, 
      loginWithGoogle,
      logout,
      updateUserProfile,
      addAddress,
      updateAddress,
      removeAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
